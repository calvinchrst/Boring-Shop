const path = require('path');
const fs = require('fs');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const p = path.join(path.dirname(process.mainModule.filename),
            'data',
            'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
            
            // Read and parse existing products from file
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }

            // Add this new product
            products.push(this);

            // Save all products back to the file
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        const p = path.join(path.dirname(process.mainModule.filename),
            'data',
            'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
            // Read and parse existing products from file
            if (err) {
                return cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
}