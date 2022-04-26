const { User } = require('../models/user');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send('Invalid email or password');

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send('Invalid email or password');

    const token = jwt.sign(_.pick(user, ['_id', 'name', 'email']), config.get('jwtPrivateKey'));
    res.send(token);
})

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(25).required().email(),
        password: Joi.string().min(5).max(25).required(),
    };
    return Joi.validate(user, schema);
}

module.exports = router;