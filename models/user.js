const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

class User {
  constructor(name, email, id, cart) {
    this.name = name;
    this.email = email;
    this._id = id ? ObjectID(id) : null;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // Update the product
      dbOp = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("users").insertOne(this);
    }

    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  addToCart(productId) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === productId.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: ObjectID(productId),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: ObjectID(id) })
      .then(user => {
        console.log("User.FindById:", user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
