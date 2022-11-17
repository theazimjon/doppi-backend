require("dotenv").config();
const User = require('../models/user.js');
const Customer = require('../models/customer.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const {ObjectId} = require("mongodb");
const {validationResult} = require("express-validator");
const sendEmail = require("../utils/email")

class AuthController {
    async signUpForBoss(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
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
            const text = `${process.env.BASE_URL}/auth/verify/${process.env.SECRET_HASH + '.' + newUser._id}`;

            await sendEmail(email, text, text);
            res.status(200).json({message: "new user saved successfully", data: {user: newUser, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async createManager(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {name, phone, email, password} = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            let newManager = new User({ role: "manager", name, phone, email, password: hashPassword, organization: ObjectId(req.user.organization), verify: true});
            console.log(newManager);
            newManager = await newManager.save();

            const client = await Customer.find({"boss": ObjectId(req.user._id)})
            console.log(client);
            client[0]?.managers.push(newManager._id);

            client[0].save();

            const token = await jwt.sign(newManager.toJSON(), process.env.ACCESS_TOKEN);

            const text = `${process.env.BASE_URL}/auth/verify/${process.env.SECRET_HASH + '.' + newManager._id}`;

            await sendEmail(email, text, text);

            res.status(200).json({message: "new user saved successfully", data: {user: newManager, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async signUpForClient(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {name, phone, email, password} = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            let newUser = new User({ role: "client", name, phone, email, password: hashPassword});

            await newUser.save();

            const token = await jwt.sign(newUser.toJSON(), process.env.ACCESS_TOKEN);

            const text = `${process.env.BASE_URL}/auth/verify/${process.env.SECRET_HASH + '.' + newUser._id}`;

            await sendEmail(email, text, text);

            res.status(200).json({message: "new user saved successfully", data: {user: newUser, token}});

        } catch (err) {
            console.log(err.message)
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async getManagers(req, res){
        try {

            const managers = await User.find({"organization": req.user.organization});

            res.status(200).json({message: "new user saved successfully", data: {users: managers}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async signIn(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
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
                        if(user.verify) {
                            return res.status(200).json({message: "logged", data: {user, token}});
                        } else {
                            return res.status(403).json({message: "Please verify you email, check spam folder too :)"})
                        }
                    }
                    else{
                        res.status(400).json({message: "invalid password"});
                    }
                });
        }
        catch (err) {
            res.status(400).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async emailVerification(req, res) {
        try {
            const token = req.params.token;
            const [hash, id] = token.split(".");
            const user = await User.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            user.verify = true;
            console.log(user);
            await user.save();
            res.status(200).json({message: "user email verified successfully redirect in production..", data: {user}});
        }
        catch (err) {
            res.status(400).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            console.log(req.user)
            const id = req.user._id;
            const user = await User.findOne({_id: ObjectId(id)});
            if(!user){
                return res.status(401).json({message: "database cleaned, please update token"})
            }
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
            console.log(err.message)
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

}

module.exports = new AuthController();