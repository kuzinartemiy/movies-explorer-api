const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  updateUser,
  getAuthorizedUser,
  getUsers,
  signOut,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

router.post('/signout', signOut);

module.exports = router;
