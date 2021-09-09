const router = require('express').Router();

const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { signinValidation, signupValidation } = require('../middlewares/validations');
const { NotFoundError } = require('../errors/NotFoundError');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use(auth, () => {
  throw new NotFoundError('404 Error.');
});

module.exports = router;
