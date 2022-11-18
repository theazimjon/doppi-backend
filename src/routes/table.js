const express = require("express");
const route = express.Router();
const Table = require("../controllers/table.controller");
const authentication = require("../middlewares/Authentification");

route.post("/add-kitchen",authentication, Table.addKitchen);
route.get("/", authentication, Table.getAll);
route.get("/kitchen", authentication, Table.getKitchens);
route.get("/table/:kitchen", authentication, Table.getAllForKitchen);
route.get("/:id", authentication, Table.getOneById);
route.post("/table/:kitchen", authentication, Table.createWithKitchen);
route.patch("/:id", authentication, Table.updateById);
route.delete("/kitchen/:id", authentication, Table.deleteKitchen);
route.delete("/:id", authentication, Table.delete);

// order
route.get("/table/qrcode/:kitchen", authentication, Table.getQRCodeLinksForKitchen);
route.get("/order/:id", authentication,Table.getOrdersForKitchen);
route.post("/client/order/:id", Table.order);
route.patch("/client/order/:id", Table.updateOrderById);


module.exports = route;