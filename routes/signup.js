const router = require('express').Router();
const { addUser } = require('../controllers/users');

router.post('/', addUser);

module.exports = router;
