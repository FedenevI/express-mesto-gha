const router = require('express').Router();
const {
  getUsers, getUserById, editUserData, editUserAvatar, getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);

router.get('/:userId', getUserById);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
