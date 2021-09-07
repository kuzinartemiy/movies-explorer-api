const Movie = require('../models/movie');

const {
  BadRequestError, // 400
  ForbiddenError, // 403
  NotFoundError, // 404
  ServerError, // 500
} = require('../errors/errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})

    .then((movies) => {
      if (!movies) {
        throw new ServerError({ message: 'Произошла ошибка при получении списка фильмов.' });
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

  Movie.Create({
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
        throw new BadRequestError({ message: 'Переданы некорректные данные при создании фильма.' });
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
        throw new NotFoundError({ message: 'Фильм с указанным _id не найден.' });
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
