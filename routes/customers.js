// const mongoose = require("mongoose");
const {Customer, validate} = require('../models/customer');

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  if (!customers || customers.length === 0)
    return res.status(404).send("Customer table is empty");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customers = await Customer.findById(req.params.id);
  if (!customers)
    return res.status(404).send("Customer with given ID was not found");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
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
  const { error } = validate(req.body);
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
  if (!customer)
    return res.status(404).send("Customer with given ID not found");
  res.send(customer);
});

module.exports = router;
