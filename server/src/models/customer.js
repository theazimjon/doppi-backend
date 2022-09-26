const { Schema, model, Types } = require("mongoose");

const clientScheme = new Schema({
        id: {
            type: String,
        },
        organizationName: {
            type: String,
            required: true
        },
        boss: {type: Types.ObjectId, ref: 'User'},
        managers: [
            {type: Types.ObjectId, ref: 'User'}
        ]
    },
    {
        timestamps: true
    });

module.exports = model("Customer", clientScheme);
