const { Schema, model, Types } = require("mongoose");
const {ObjectId} = require("mongodb");

const tableScheme = new Schema({
        name: {
            type: String,
            maxlength: 22,
            minlength: 4,
            required: true
        },
        address: {
            type: String,
            maxlength: 22,
            minlength: 2
        },
        number: {
            type: Number
        },
        photo: {
            type: String    
        },
        status: {
            type: String,
            default: "active",
            enum: [
                "active",
                "not active"
            ]
        },
        kitchen: {
            type: ObjectId,
            ref: "Kitchen"
        },
        owner: {
           type: ObjectId,
           ref: "Customer"
        }
    },
    {
        timestamps: true
    });

module.exports = model("Table", tableScheme);