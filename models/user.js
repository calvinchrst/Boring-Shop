const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
    this._id = id ? ObjectID(id) : null;
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
