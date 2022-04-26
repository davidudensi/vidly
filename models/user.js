const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(25).required(),
        email: Joi.string().min(5).max(25).required().email(),
        password: Joi.string().min(5).max(25).required(),
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
