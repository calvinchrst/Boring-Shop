const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");

const errorController = require("./controllers/error");
const User = require("./models/user");

// Set up config file which stores sensitive information
const configPath = "./db_config.json";
const config = JSON.parse(fs.readFileSync(configPath, "UTF-8"));

const MONGODB_URI =
  config.databaseUrlPrefix +
  config.username +
  ":" +
  config.password +
  config.databaseUrlPostfix;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sesssions"
});
// Initialize CSRF protection
const csrfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);

// Initialize User
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Setup connection to mongoDB
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
    console.log("Server startup Done");
  })
  .catch(err => {
    console.log(err);
  });
