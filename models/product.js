const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = (id == null) ? Math.random() : id;
  }

  static getProductsFromFile(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }

  save() {
    Product.getProductsFromFile(products => {
      // If id is an existing id, then we replace existing product with THIS new product
      // Else we add THIS new product
      const existingProductIndex = products.findIndex(p => p.id == this.id);
      let updatedProducts;
      if (existingProductIndex != -1) {     // Existing product found
        updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
      } else {    // No existing product found
        updatedProducts = products;
        updatedProducts.push(this);
      }

      // Save it to file
      Product.saveProducts(updatedProducts);
    });
  }

  static fetchAll(cb) {
    Product.getProductsFromFile(cb);
  }

  static findById(id, cb) {
    Product.getProductsFromFile(products => {
      const product = products.find(p => p.id == id);
      cb(product);
    });
  }

  static deletedById(id) {
    Product.getProductsFromFile(products => {
      const updatedProducts = products.filter(p => p.id != id);
      Product.saveProducts(updatedProducts);
    });
  }

  static saveProducts(products) {
    fs.writeFile(p, JSON.stringify(products), err => {
      console.log(err);
    });
  }
};
