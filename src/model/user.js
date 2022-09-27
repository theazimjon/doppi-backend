const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema({
    kitchenName: {
        type: String,
        min: 3,
        max: 255,
        required: true,
    },
    placeAddress: {
        type: String,
        min: 3,
        max: 255,
        required: true,
    },
    phoneNumber: {
        type: String,
        min: 3,
        max: 22,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(4)
        // need to validate
    });
    return schema.validate(user);
};

module.exports = {
    User,
    validate,
};