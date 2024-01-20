const User = require('../models/user');

const CREATED = 201;
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка. Подробнее:${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
        return;
      }
      res.status(OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некоррекный ID' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка.Подробнее:${err.message}` });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(NOT_FOUND).send({ message: `Пользователь по указанному ID не найден.Подробнее:${err.message}` });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(NOT_FOUND).send({ message: `Пользователь по указанному ID не нйден.Подробнее:${err.message}` });
      }
    });
};
