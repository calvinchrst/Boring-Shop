const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = ObjectID(id);
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // Update the product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchProductById(id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: mongodb.ObjectID(id) })
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: ObjectID(id) })
      .then(result => {
        console.log("deleted");
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
