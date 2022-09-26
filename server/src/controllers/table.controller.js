const Table = require('../models/table.js');
const Kitchen = require('../models/kitchen.js');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

class ProductController {

    async addKitchen(req, res) {

        try {
            const { name } = req.body;
            const kitchen = new Kitchen({
                name
            });

            console.log(kitchen)

            await kitchen.save();
            return res.status(201).json({ message: "kitchen created successfully", kitchen});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getKitchens(req, res) {
        try {
            const kitchens = await Kitchen.findById(req.user._id);
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
            const { name, address, number, status} = req.body;
            const table = new Table({
                name, address, number, status
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
            const {name, address, number, status} = req.body;
            const table = await Table.findByIdAndUpdate(id, {name, address, number, status}, {
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