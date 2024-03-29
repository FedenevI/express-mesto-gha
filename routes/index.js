const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use(auth); // либо в каждый через запятую?
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
