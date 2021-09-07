const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

module.exports = router;
