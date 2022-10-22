const { Schema, model, Types } = require("mongoose");

const categoryScheme = new Schema({
        name: {
            type: String,
            maxlength: 22,
            minlength: 4,
            required: true
        },
        photo: {
            type: String    
        },
        organization: {type: Types.ObjectId, ref: 'Customer'},
        },
    {
        timestamps: true
    });

module.exports = model("Category", categoryScheme);