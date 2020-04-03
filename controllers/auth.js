const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const BCRYPT_NR_HASH = 12;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "***REMOVED***"
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const validationErrors = validationResult(req);
  const validationErrorsArray = validationResult(req).array();

  // Check for any validatione errors
  if (!validationErrors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: validationErrorsArray[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: validationErrorsArray
    });
  }

  // Get user of with the inputted email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }

      // Else if user is found (i.e., email is found in the database):
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              // Explicityly call save so that the redirect is fired after the session is updated on database
              res.redirect("/");
            });
          }

          // Else password and user don't match.
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          return res.redirect("/login"); // TODO: Inform user something is wrong with the system
        });
    })
    .catch(err => console.log(err));

  User.findById("5e82997f99ae9937c860beaf")
    .then(user => {})
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const validationErrors = validationResult(req);
  const validationErrorsArray = validationResult(req).array();

  if (!validationErrors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: validationErrorsArray[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: validationErrorsArray
    });
  }

  bcrypt
    .hash(password, BCRYPT_NR_HASH) // Generate hash password
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "calvin@simple-marketplace.com",
        subject: "Signup Successful",
        html: "<h1>You successfully signed up!</h1>"
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    console.log("Token", token);

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found");
          req.session.save(err => {
            // Explicityly call save so that the redirect is fired after the session is updated on database
            return res.redirect("/reset");
          });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect("/login");
        return transporter.sendMail({
          to: req.body.email,
          from: "calvin@simple-marketplace.com",
          subject: "Password reset",
          html: `
          <p> You requested password reset </p>
          <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  // Check if reset password token is valid
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash(
          "error",
          "Invalid / Expired Reset Link. Please request another reset password email"
        );
        return req.session.save(err => {
          // Explicityly call save so that the redirect is fired after the session is updated on database
          return res.redirect("/reset");
        });
      }

      // If user is found
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  resetToken = req.body.resetToken;
  newPassword = req.body.password;
  userId = req.body.userId;

  // Check if corresponding user with the token and userId indeed exist
  User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (!user) {
        req.flash(
          "error",
          "Invalid / Expired Reset Link. Please request another reset password email"
        );
        return req.session.save(err => {
          // Explicityly call save so that the redirect is fired after the session is updated on database
          return res.redirect("/reset");
        });
      }

      // else if user is found
      bcrypt
        .hash(newPassword, 12) // Generate hash password
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.save().then(result => {
            res.redirect("/login");
          });
        });
    })
    .catch(err => console.log(err));
};
