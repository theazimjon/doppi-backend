const express = require("express");
const route = express.Router();
const Auth = require("../controllers/auth.controller");
const authentication = require("../middlewares/Authentification");


route.post("/sign-up-boss", Auth.signUpForBoss);
route.post("/sign-up", Auth.signUpForClient);
route.post("/verify/:token", Auth.signIn);
route.post("/sign-in", Auth.signIn);
route.post("/add-manager", authentication, Auth.createManager);
route.get("/get-managers", authentication, Auth.getManagers);
route.patch("/update-password", authentication, Auth.updatePassword);
route.delete("/sign-out", authentication, Auth.signOut);

module.exports = route;