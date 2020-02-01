const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static getCartFromFile = cb => {
        fs.readFile(p, (err, filecontent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(filecontent);
            }
            cb(cart);
        });
    }

    static saveCartToFile = cart => {
        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        });
    }

    static addProduct(id, productPrice) {
        // Fetch previous cart
        Cart.getCartFromFile(cart => {
            
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            let updatedProduct;

            // Add new product / increase quantity
            if (existingProductIndex != -1) {
                let existingProduct;
                existingProduct = cart.products[existingProductIndex];
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;

            // Save new cart to file
            Cart.saveCartToFile(cart);
        });
    }

    static deleteProduct(id, productPrice) {
        Cart.getCartFromFile(originalCart => {
            // Check if product exist in the cart
            const product = originalCart.products.find(p => p.id == id);

            // Remove the product from cart
            if (product) {
                const updatedCartProducts = originalCart.products.filter(p => p.id != id);
                const priceToReduce = product.qty * productPrice;
                const updatedCart = { products: updatedCartProducts, totalPrice: originalCart.totalPrice - priceToReduce };

                // Save the updatedCart back to file
                Cart.saveCartToFile(updatedCart);
            }
            // else do nothing if we don't found the product
        });
    }
}