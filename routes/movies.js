const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');

const {
  BadRequestError,
} = require('../errors/errors');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Невалидный URL');
    }),
    trailer: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Невалидный URL');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Невалидный URL');
    }),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
