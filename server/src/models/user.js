const { Schema, model, Types } = require("mongoose");
const {ObjectId} = require("mongodb");

const user = new Schema({
    role : {
        type: String,
        alias : [
            "boss",
            "manager",
            "client"
        ]
    },
    organization: {
        type: ObjectId,
        ref: "Customer"
    },
    name: {
        type: String,
        maxlength: 22,
        minlength: 4,
        required: true,
        trim: true
    },
    address: {
        type: String,
        maxlength: 22,
        minlength: 2
    },
    phone: {
        type: String,
        trim: true
    },
    avatar:{type: String},
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

module.exports = model("Boss", user);