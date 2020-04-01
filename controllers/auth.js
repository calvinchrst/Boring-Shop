const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Get user of with the inputted email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect("/login"); // TODO: Inform user of the invalid email & password combination
      }

      // Else if user is found (i.e., email is found in the database):
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
              // Explicityly call save so that the redirect is fired after the session is updated on database
              res.redirect("/");
            });
          } else {
            res.redirect("/login"); // TODO: Inform user of the invalid email & password combination
          }
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
        return res.redirect("/signup"); // TODO: Inform that existing email already registered
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
