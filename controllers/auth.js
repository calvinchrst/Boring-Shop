const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        ***REMOVED***
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
    errorMessage: message
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
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Get user of with the inputted email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return req.session.save(err => {
          // Explicityly call save so that the redirect is fired after the session is updated on database
          return res.redirect("/login");
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
          req.flash("error", "Invalid email or password");
          return req.session.save(err => {
            // Explicityly call save so that the redirect is fired after the session is updated on database
            res.redirect("/login");
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
  const confirmPassword = req.body.confirmPassword;

  // Temporarily ignore user input validation

  // Find existing user, if any
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          "error",
          "Email already registered. Please input another one or log in"
        );
        return req.session.save(err => {
          // Explicityly call save so that the redirect is fired after the session is updated on database
          return res.redirect("signup");
        });
      }
      return bcrypt
        .hash(password, 12) // Generate hash password
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
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
