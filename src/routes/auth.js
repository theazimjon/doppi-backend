const express = require("express");
const route = express.Router();
const Auth = require("../controllers/auth.controller");
const authentication = require("../middlewares/Authentification");
const { body, validationResult } = require('express-validator');


route.post("/sign-up-boss",
    body('name', "minimum 3 characters").isLength({min: 3, max: 100}),
    body('password', 'Please set strong password(at least a symbol, upper and lower case letters and a numb)').escape()
        .isLength({min: 8, max:40}).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    body("email", "please provide a valid email").isEmail(),
    Auth.signUpForBoss);

route.post("/sign-up",
    body('name', "minimum 3 characters").isLength({min: 3, max: 100}),
    body('password', 'Please set strong password(at least a symbol, upper and lower case letters and a numb)').escape()
        .isLength({min: 8, max:40}).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    body("email", "please provide a valid email").isEmail(),
    Auth.signUpForClient);
route.post("/verify/:token", Auth.signIn);
route.post("/sign-in",
    body("email", "please provide a valid email").isEmail(),
    Auth.signIn);
route.post("/add-manager",
    body('name', "minimum 3 characters").isLength({min: 3, max: 100}),
    body('password', 'Please set strong password(at least a symbol, upper and lower case letters and a numb)').escape()
        .isLength({min: 8, max:40}).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    body("email", "please provide a valid email").isEmail(),
    authentication, Auth.createManager);
route.get("/get-managers", authentication, Auth.getManagers);
route.patch("/update-password", authentication,
    body('password', 'Please set strong password(at least a symbol, upper and lower case letters and a numb)').escape()
        .isLength({min: 8, max:40}).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    Auth.updatePassword);
route.delete("/sign-out", authentication, Auth.signOut);

module.exports = route;