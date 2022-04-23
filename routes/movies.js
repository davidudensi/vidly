const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    if (!movies || movies.length === 0)
        return res.status(404).send("Movie collection is empty");
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movies = await Movie.findById(req.params.id);
    if (!movies)
      return res.status(404).send("Movie with given ID was not found");
    res.send(movies);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Genre with given ID not found');
  
    const movie = new Movie({
      name: req.body.name,
      genre: {
          _id: genre._id,
          name: genre.name,
      }
    });
    try {
      const result = await movie.save();
      res.send(result);
    } catch (ex) {
      res.status(400).send('Unable to add movie');
    }
});

module.exports = router;