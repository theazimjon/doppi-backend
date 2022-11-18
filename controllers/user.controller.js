const User = require('../models/user.js');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

class UserController {
    async getAll(req, res) {
        try {
            console.log("------ all user ********************************");
            const users = await User.find();
            return res.status(200).json({data: users});
        } catch (err) {
            res.status(500).json({message: `${err.message} , please try again later`});
        }
    }
    async getOne(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: 'please provide a valid id' });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({message: `${err.message} , please try again later`});
        }
    }

    async edit (req, res) {
        try {
            const id = req.user._id;
            const { name, address, phone, email, password} = req.body;

            const updateUser = await User.findByIdAndUpdate(id, {name, address, phone, email, password}, {
                new: true,
                omitUndefined: true
            });

            if(!updateUser){
                return res.setHeader('Content-Type', 'application/json').status(404).json({ message: "user not found" });
            }
            return res.status(200).json(updateUser);
        } catch (err) {
            res.status(500).json({message: `${err.message} , please try again later`});
        }
    }
    async delete (req, res) {
        try {
            const id = req.user._id;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            await User.findByIdAndDelete(id);

            return res.status(200).json({ message: "successfully deleted" });
        } catch (err) {
            res.status(500).json({message: `${err.message} , please try again later`});
        }
    }

}

module.exports = new User()