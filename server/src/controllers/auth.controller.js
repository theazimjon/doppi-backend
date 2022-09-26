require("dotenv").config();
const User = require('../models/user.js');
const Customer = require('../models/customer.js');
const TokenBlockList = require('../models/tokenBlockList'); // redis? :(
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const {ObjectId} = require("mongodb");

class AuthController {

    async signUpForBoss(req, res){
        try {
            const {name, address, phone, email, password} = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            let newUser = new User({ role: "boss", name, address, phone, email, password: hashPassword});
            let customer = new Customer({
                organizationName: name,
                boss: newUser._id
            })

            newUser.organization = customer._id;
            await customer.save();
            await newUser.save();

            const token = await jwt.sign(newUser.toJSON(), process.env.ACCESS_TOKEN);

            res.status(200).json({message: "new user saved successfully", data: {user: newUser, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async createManager(req, res){
        try {
            const {name, phone, email, password} = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            let newManager = new User({ role: "manager", name, phone, email, password: hashPassword, organization: ObjectId(req.user.organization)});
            console.log(newManager);
            newManager = await newManager.save();

            const client = await Customer.find({"boss": ObjectId(req.user._id)})

            client[0]?.managers.push(newManager._id);

            client.save();

            const token = await jwt.sign(newManager.toJSON(), process.env.ACCESS_TOKEN);

            res.status(200).json({message: "new user saved successfully", data: {user: newManager, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async signUpForClient(req, res){
        console.log("--------------------------------Signing up...");
        try {
            const {name, phone, email, password} = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            let newUser = new User({ role: "client", name, phone, email, password: hashPassword});
            console.log(newUser)
            await newUser.save();

            const token = await jwt.sign(newUser.toJSON(), process.env.ACCESS_TOKEN);

            res.status(200).json({message: "new user saved successfully", data: {user: newUser, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async signIn(req, res){
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});
            if (!user) {
                throw new Error("User not found");
            }
            const token = await jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN);

            bcrypt.compare(password,user.password)
                .then (r => {
                    if(r){
                        res.status(200).json({message: "logged", data: {user, token}});
                    }
                    else{
                        res.status(400).json({message: "invalid password"});
                    }
                })
        }
        catch (err) {
            res.status(400).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async emailVerification(req, res) {
        const token = req.params.token;

    }

    async signOut(req, res){
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            const newTokenBlockList = new TokenBlockList({token});
            await newTokenBlockList.save();
            res.status(200).json({message: "logged out successfully"});
        }
        catch (err) {
            res.status(400).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async updatePassword(req, res){
        try {
            const id = req.user._id;
            const user = await User.findOne({_id: ObjectId(id)});
            const {currentPassword, password} = req.body;
            const auth = await bcrypt.compare(currentPassword,user.password);
            console.log(auth);

            if(auth === false)
                res.status(401).json({message: "invalid password"});
            else{
                user.password = await bcrypt.hash(password, 10);
                await user.save();
                res.status(200).json({message: "user password has been updated successfully", data: {user}});
            }
        }
        catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

}

module.exports = new AuthController();