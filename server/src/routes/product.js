const express = require("express");
const route = express.Router();
const Product = require("../controllers/product.controller");
const authentication = require("../middlewares/Authentification");


route.post("/add-category", Product)
route.get("/:category", Product.getAllForCategory);
route.get("")

