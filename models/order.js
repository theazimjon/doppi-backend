const { Schema, model, Types } = require("mongoose");

const orderScheme = new Schema({
        products: [{
            id: {
                type: Types.ObjectId,
                ref: 'Order',
                required: true
            },
            count: {
                type: Number,
                required: true
            }
        }],
        table: {
            type: Types.ObjectId,
            ref: 'Table',
            required: true
        },
        price: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'canceled']
        },
        kitchen: {type: Types.ObjectId, ref: 'Kitchen'},
        owner: {type: Types.ObjectId, ref: 'Customer'}
    },
    {
        timestamps: true
    });

module.exports = model("Order", orderScheme);