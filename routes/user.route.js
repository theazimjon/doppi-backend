const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Token = require("../model/token");
const { User, validate } = require("../model/user");
const express = require("express");
const router = express.Router();
const ULID = require('ulid')

router.post("/register", async (req, res) => {
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send("User with given email already exist!");

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        user = await new User({
            kitchenName: req.body.kitchenName,
            placeAddress: req.body.placeAddress,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hashPassword
        }).save();

        let token = await new Token({
            userId: user._id,
            token:ULID.ulid()
        }).save();

        const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
        console.log()
        await sendEmail(user.email, "Verify Email", message);

        res.status(200).json({message: "An Email sent to your account please verify", verify: user.email +  " Verify Email " + message});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const {email, password} = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({message: "User not found"});
        }
        const token = await jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN);

        bcrypt.compare(password, user.password)
            .then (r => {
                if(r){
                    if(user.verified) {
                        res.status(200).json({message: "logged, redirected to main page", data: {user, token}});
                    }
                    else {
                        res.status(401).json({message: "required email verification"});
                    }
                }
                else{
                    res.status(400).json({message: "invalid password"});
                }
            })
    } catch (error) {
            res.status(400).send(error.message);
    }
});


router.get("/verify/:id/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, verified: true });
        await Token.findByIdAndRemove(token._id);

        res.send("email verified successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;