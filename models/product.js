const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = (id == null) ? Math.random() : id;
  }

  save() {
    getProductsFromFile(products => {
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
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id == id);
      cb(product);
    });
  }

  static deletedById(id) {
    getProductsFromFile(products => {
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
