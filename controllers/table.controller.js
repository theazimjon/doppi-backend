require("dotenv").config();
const Table = require('../models/table.js');
const Kitchen = require('../models/kitchen.js');
const Order = require('../models/order.js');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

class TableController {

    async order(req, res) {
        try {
            const kitchen  = req.params.id;
            const { products, price, status, table } = req.body;
            if(!(table.match(/^[0-9a-fA-F]{24}$/) || kitchen.match(/^[0-9a-fA-F]{24}$/)))
                return res.status(403).json({message: "please provide a valid databse id for kitchen and table "});
            const order = new Order({
                products,
                table,
                price,
                kitchen,
                status
            });

            console.log(order);

            await order.save();
            return res.status(201).json({ message: "order created successfully", kitchen});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getOrdersForKitchen(req, res) {
        const kitchen = req.params.id;
        if (kitchen.match(/^[0-9a-fA-F]{24}$/))
            return res.status(404).json({ message: "Please provide a valid kitchen" });
        try {
            const orders = await Order.find({"kitchen": kitchen});
            return res.status(200).json(orders);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async updateOrderById(req, res) {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(404).json({ message: "Please provide a valid id" });

        try {
            const {products, price, status, kitchen, table} = req.body;
            const order = await Order.findByIdAndUpdate(id, {
                products,
                table,
                price,
                kitchen,
                status
            }, {
                new: true,
                omitUndefined: true
            });
            console.log(order)
            await order.save();
            return res.status(201).json({ message: "Table updated successfully", table});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async addKitchen(req, res) {
        try {
            const { photo, name } = req.body;
            const kitchen = new Kitchen({
                photo,
                name,
                owner: req.user.organization
            });

            console.log(kitchen);

            await kitchen.save();
            return res.status(201).json({ message: "kitchen created successfully", kitchen});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getKitchens(req, res) {
        try {
            const kitchens = await Kitchen.find({"owner" : req.user.organization});
            return res.status(200).json(kitchens);
        } catch (e) {
            return res.status(500).json({ message: `Error in ${e}, pls try again` });
        }
    }

    async deleteKitchen(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });
        try {
            await Kitchen.findByIdAndDelete(id);
            return res.status(200).json({ message: "Category deleted successfully" });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }


    async getAll(req, res) {
        try {
            const tables = await Table.find();
            return res.status(200).json(tables);
        } catch (e) {
            return res.status(500).json({ message: `Error in ${e}, pls try again` });
        }
    }

    async getAllForKitchen(req, res) {
        const kitchen = req.params.kitchen;
        if (!kitchen)
            return res.status(404).json({ message: "Please provide a valid category" });

        try {
            const tables = await Table.find({"kitchen": kitchen});
            return res.status(200).json(tables);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }


    async getQRCodeLinksForKitchen(req, res) {
        const kitchen = req.params.kitchen;
        if (!kitchen)
            return res.status(404).json({ message: "Please provide a valid category" });

        try {
            const tables = await Table.find({"owner": req.user.organization});
            const qrLinks = tables.map((item) => process.env.LINK_FOR_CLIENT + item._id + "." + item.owner);
            return res.status(200).json({count: qrLinks.length,qrLinks});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getOneById(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(404).json({ message: "invalid id" });

            const table = await Table.findById(id);

            return res.status(200).json(table);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async createWithKitchen(req, res) {

        const kitchen = req.params.kitchen;

        if (!kitchen)
            return res.status(404).json({ message: "Please provide a valid id" });

        try {
            const { name, address, number, photo, status} = req.body;
            const table = new Table({
                name, address, number, photo, status,
                kitchen: ObjectId(kitchen),
                owner: ObjectId(req.user.organization),
            });

            console.log(table)

            await table.save();
            return res.status(201).json({ message: "Table created successfully", table});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });
        try {
            await Table.findByIdAndDelete(id);
            return res.status(200).json({ message: "table deleted successfully" });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async updateById(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });

        try {
            const {name, address, number, photo, status} = req.body;
            const table = await Table.findByIdAndUpdate(id, {name, address, number, photo, status}, {
                new: true,
                omitUndefined: true
            });
            console.log(table)
            await table.save();
            return res.status(201).json({ message: "Table updated successfully", table});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
}

module.exports = new TableController();