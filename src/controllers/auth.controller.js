require("dotenv").config();
const User = require('../models/user.js');
const Customer = require('../models/customer.js');
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const bcrypt = require("bcrypt")
const {ObjectId} = require("mongodb");
const DOMAIN = "sandbox4da593123ed3421da67dcd37da459b47.mailgun.org"

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
            // const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
            // const data = {
            //     from: `theazimjon@gmail.com`,
            // to: `makeyem777@dnitem.com`,
            // subject: "Hello",
            // text: "<h2>Please click on given link to activate your account</h2>\n" +
            //     "\n" +
            //     "<p>`${process.env.CLIENT_URL}${token}`</p>"
            // };
            //
            // mg.messages().send(data, function (error, body) {
            //     console.log(body);
            // });


            res.status(200).json({message: "new user saved successfully", data: {user: newUser, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async createManager(req, res){
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

            res.status(200).json({message: "new user saved successfully", data: {user: newManager, token}});

        } catch (err) {
            res.status(500).json({message: `${err.message.split(":")[2] || err.message}, please try again later`});
        }
    }

    async signUpForClient(req, res){

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

    async getManagers(req, res){
        try {

            const managers = await User.find({"organization": req.user.organization});

            res.status(200).json({message: "new user saved successfully", data: {users: managers}});

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