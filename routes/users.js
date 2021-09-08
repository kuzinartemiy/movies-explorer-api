const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/validation');
const {
  updateUser,
  getAuthorizedUser,
  signOut,
} = require('../controllers/users');

router.get('/me', getAuthorizedUser);

router.patch('/me', updateUserValidation, updateUser);

router.post('/signout', signOut);

module.exports = router;
