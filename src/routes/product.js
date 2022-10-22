const express = require("express");
const route = express.Router();
const Product = require("../controllers/product.controller");
const authentication = require("../middlewares/Authentification");


route.post("/add-category", authentication, Product.addCategory);
route.get("/categories", authentication, Product.getCategories);
route.get("/category/:category", authentication, Product.getAllForCategory);
route.get("/product/:id", authentication, Product.getOneById);
route.post("/:category", authentication, Product.createWithCategory);
route.patch("/:id", authentication, Product.update);
route.delete("/category/:id", authentication, Product.deleteCategory);
route.delete("/:id", authentication, Product.delete);

module.exports = route;