const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')

const jsonProducts = fs.readFileSync(path.resolve(__dirname, '../mock-data/products.json'), 'utf8');
console.log(jsonProducts)
const products = JSON.parse(jsonProducts);
console.log(products)

// Getting all
router.get('/', (req, res) => {
    {const productList = products.map((product) => {
        return (
            {"name":product.name, "sku":product.sku, "price":product.price, "link":product.link}
        )
    })
    res.json(productList)
    }
})

module.exports = router;