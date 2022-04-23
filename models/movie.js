const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const movieSchema = mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, default: 0, max: 10, min: 0 },
    dailyRentalRate: { type: Number, default: 0, max: 10, min: 0 },
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = {
        name: Joi.string().required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    }
    return Joi.validate(movie, schema);
}

//Custom schemas
const movieForRental = mongoose.Schema({
  name: { type: String, required: true, minLength: 5 },
  dailyRentalRate: { type: Number, default: 0, max: 10, min: 0 },
});

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieForRental = movieForRental;