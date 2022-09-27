require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./src/config/db");
const user = require("./src/routes/user.route");

app.use(express.json());

(async () => await connection())();

app.use("/api/user", user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));