const mongoose = require('mongoose');
const Joi = require('joi');
const { movieForRental } = require('./movie');
const { customerForRental } = require('./customer');

const rentalSchema = mongoose.Schema({
    customer: {
        type: customerForRental,
        required: true,
    },
    movie: {
        type: movieForRental,
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    returnDate: { type: Date },
    rentalFee: { type: Number, min: 0}
});
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    }
    return Joi.validate(rental, schema);
}

exports.validate = validateRental;
exports.Rental = Rental;