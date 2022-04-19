const mongoose = require("mongoose");
const Joi = require("joi");

const express = require("express");
const router = express.Router();

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

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  if (!customers || customers.length === 0) return res.status(404).send("Customer table is empty");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customers = await Customer.findById(req.params.id);
  if (!customers)
    return res.status(404).send("Customer with given ID was not found");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  try {
    const result = await customer.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(`Unable to add customer: ${ex.message}`);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with given ID not fount");
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('Customer with given ID not found');
    res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).required(),
    phone: Joi.number().required(),
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
