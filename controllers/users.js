const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
  BadRequestError, // 400
  UnauthorizedError, // 401
  NotFoundError, // 404
  ConflictError, // 409
} = require('../errors/errors');

const User = require('../models/user');

module.exports.getAuthorizedUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })

    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован.');
      }

      User.findByIdAndUpdate(
        { _id: id },
        { name, email },
        { new: true },
      )
        .then((userToUpdate) => {
          if (!userToUpdate) {
            throw new BadRequestError('Пользователь по указанному _id не найден.');
          }

          res.send(userToUpdate);
        })

        .catch(next);
    })

    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !password || !email) {
    throw new BadRequestError('Email, пароль или имя не могут быть пустыми.');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким Email уже существует.');
      }

      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            email,
            password: hash,
          })
            .then((newUser) => {
              if (!newUser) {
                throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
              }
              res.status(201).send(newUser);
            })

            .catch(next);
        })

        .catch(next);
    })

    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми.');
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователя не существует.');
      }

      bcrypt.compare(password, user.password)

        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError('Неправильный пароль.');
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

          res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000 * 24,
          }).send({ token });
        })

        .catch(next);
    })

    .catch(next);
};

module.exports.signOut = (req, res) => {
  res.cookie('jwt', {
    maxAge: 0,
  });

  res.send({ message: 'Cookie deleted.' });
};
