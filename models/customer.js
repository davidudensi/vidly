const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minLength: 5 },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (p) {
        return p.length >= 5;
      },
    },
    message: "Phone number must be at least 5 digits",
  },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).required(),
    phone: Joi.number().required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;