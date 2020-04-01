const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("5e82997f99ae9937c860beaf")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Setup connection to mongoDB
configPath = "./db_config.json";
config = JSON.parse(fs.readFileSync(configPath, "UTF-8"));
mongodbConnectionURL =
  config.databaseUrlPrefix +
  config.username +
  ":" +
  config.password +
  config.databaseUrlPostfix;
mongoose
  .connect(mongodbConnectionURL)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log("Server startup Done");
  })
  .catch(err => {
    console.log(err);
  });
