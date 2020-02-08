const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = (id == null) ? Math.random() : id;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description] 
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    console.log(id);
    return db.execute(
      'SELECT * FROM products WHERE products.id = ?',
      [id]
    );
  }

  static deletedById(id) {
  }

  static saveProducts(products) {
  }
}
