require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const {connect} = require("mongoose");
const app = express();


app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(cors({
    origin : ['*', "https://doppi-frontend.vercel.app", "https://doppi-order.netlify.app"], // !!! dev mode
    credentials:true
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());



app.get("/", (req, res) => {
    res.send("<h2 style='color: red;' >Working backend app!\n Created by Azimjon Umarov \n  For URBAN.TECH UZBEKISTAN hackathon </h2>");
});

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});


app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/product", require("./src/routes/product"));
app.use("/api/table", require("./src/routes/table"));


connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err)
        return console.log("   !!! Error occurred !!!\n" + err["message"]);
    app.listen(process.env.PORT, () => {
        console.log(`   *** Listening on port ${process.env.PORT} ***\n     --- Mongodb connected ----`);
    });
});
