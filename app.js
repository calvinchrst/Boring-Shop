const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
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

app.use(errorController.get404);

// Set Sequelize / Database Table association
Product.belongsTo(User, { constraints: true, onDelete: "cascade" });
User.hasMany(Product);

// Initialize Database & Start Listening
sequelize
  .sync()
  // .sync({ force: true })
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    // If Dummy User with Id 1 does not exist, create it & use it. Otherwise just use existing user with id 1.
    if (!user) {
      return User.create({ name: "Max", email: "test@gmail.com" });
    }
    return User; // By right should be return Promise.resolve(user)
    // By right, This is inconsistent return because if the user is null we return a promise and if not, we return an object.
    // However, because you return a value in a then block, it is automatically wrap into a new promise
  })
  .then(user => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

console.log("Server startup Done");
