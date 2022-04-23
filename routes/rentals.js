const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
    const rentals = await Rental.find();
    if (!rentals || rentals.length === 0)
        return res.status(404).send("Rental collection is empty");
    res.send(rentals);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const movie = await Movie.findById(req.body.movieId);
        if (!movie)
            return res.status(404).send("Movie with given ID not found");
        if (movie.numberInStock === 0)
            return res.status(404).send("Movie out of stock");
        const customer = await Customer.findById(req.body.customerId);
        if (!customer)
            return res.status(404).send("Customer with given ID not found");

        const rental = new Rental({
            movie: {
                _id: movie._id,
                name: movie.name,
                dailyRentalRate: movie.dailyRentalRate,
            },
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
        });
        const result = await rental.save();
        if(result) {
            movie.numberInStock--;
            movie.save();
        }
        res.send(result);
    } catch (ex) {
        console.log(ex);
        res.status(500).send("An error occured when adding rental");
    }
});

module.exports = router;
