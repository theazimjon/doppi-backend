const { Schema, model, Types } = require("mongoose");

const productScheme = new Schema({
        name: {
            type: String,
            maxlength: 22,
            minlength: 4,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: String
        },
        time:{
            type: String
        },
        photo:{
            type: String
        },
        weight: {
            type: String
        },
        status: {
            type: String,
            required: true
        },
        kitchen: {
            type: String
        },
        organization: {type: Types.ObjectId, ref: 'Customer'}
    },
    {
        timestamps: true
    });

module.exports = model("Product", productScheme);