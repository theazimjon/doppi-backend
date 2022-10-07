const Product = require('../models/product.js');
const Category = require('../models/category.js');
const { ObjectId } = require('mongodb');

class ProductController {

    async addCategory(req, res) {
        try {
            const { name } = req.body;
            const category = new Category({
                name,
                organization: ObjectId(req.user.organization)
            });

            console.log(category);

            await category.save();
            return res.status(201).json({ message: "category created successfully", category});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await Category.find({"category" : ObjectId(req.user.organization)});
            return res.status(200).json(categories);
        } catch (e) {
            return res.status(500).json({ message: `Error in ${e}, pls try again` });
        }
    }

    async deleteCategory(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });
        try {
            await Category.findByIdAndDelete(id);
            return res.status(200).json({ message: "Category deleted successfully" });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }


    async getAllForCategory(req, res) {
        const category = req.params.category;
        if (!category)
            return res.status(404).json({ message: "Please provide a valid category" });

        try {
            const products = await Product.find({"category": category});
            return res.status(200).json(products);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async getOneById(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(404).json({ message: "invalid id" });

            const project = await Product.findById(id);

            return res.status(200).json(project);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async createWithCategory(req, res) {
        const category = req.params.category;

        if (!category)
            return res.status(404).json({ message: "Please provide a valid id" });

        try {
            const { name, price, time, weight, status } = req.body;
            const product = new Product({
                name, price, time, weight, status, category,
                organization: ObjectId(req.user.organization)
            });

            console.log(product);

            await product.save();
            return res.status(201).json({ message: "Product created successfully", product});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });

        try {
            await Product.findByIdAndDelete(id);
            return res.status(200).json({ message: "Product deleted successfully" });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async update(req, res) {
        const id = req.params.id;
        if (!id)
            return res.status(404).json({ message: "Please provide a valid id" });
        try {
            const { name, price, time, weight, status, category } = req.body;
            const product = await Product.findByIdAndUpdate(id, {name,category, price, time, weight, status}, {
                new: true,
                omitUndefined: true
            });
            console.log(product)
            await product.save();
            return res.status(201).json({ message: "ProductController updated successfully", product});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

}

module.exports = new ProductController();