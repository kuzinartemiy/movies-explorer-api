const Movie = require('../models/movie');

const { BadRequestError } = require('../errors/BadRequestError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  const ownerId = req.user._id;

  Movie.find({ owner: ownerId })

    .then((movies) => {
      if (movies.length === 0) {
        throw new NotFoundError('Список фильмов пуст.');
      }

      res.send(movies);
    })

    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const ownerId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Переданы некорректные данные при создании фильма.');
      }

      res.send(movie);
    })

    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)

    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }

      const ownerId = movie.owner.toString();

      if (ownerId !== userId) {
        throw new ForbiddenError('Авторизованный пользователь не является хозяином фильма.');
      }

      Movie.deleteOne({ _id: movieId })

        .then((deletedMovie) => {
          res.send(deletedMovie);
        })

        .catch(next);
    })

    .catch(next);
};
