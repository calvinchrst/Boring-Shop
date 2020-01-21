const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProducts = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        // Read and parse existing products from file
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        getProducts((products) => {
            // getProducts will read all products from the file
            this.title = title;
            this.id = products.length;
            this.imageUrl = imageUrl;
            this.description = description;
            this.price = price;
        })
    }

    save() {
        getProducts((products) => {
            // getProducts will read all products from the file

            // Add this new product
            products.push(this);

            // Save all products back to the file
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProducts(cb);
    }

    static getProduct(targetProductId, cb) {
        getProducts((products) => {
            var product
            for (product of products) {
                if (product.id == targetProductId) {
                    cb(product);
                }
            }
            
            console.log("Error: ProductId", targetProductId, "not found")
        });
    }
}