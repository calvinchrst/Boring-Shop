exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true; // Temporary didn't do any authentication to test how session works
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
