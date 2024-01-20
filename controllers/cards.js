const Card = require('../models/card');

// const CREATED = 201;
// const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.send(data))
        .catch((err) => res.status(NOT_FOUND).send({ message: `Карточки с таким ID нет. Подробнее:${err.message}` }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Ошибка на стороне сервера. Подробнее:${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndDelete(req.params.cardId)
      .orFail()
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND).send({ message: 'Карточки с таким ID нет' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch((err) => res.status(NOT_FOUND).send({ message: `Карточки с таким ID нет. Подробнее:${err.message}` }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный ID карты' });
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail()
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND).send({ message: 'Карточки с таким ID нет' });
          return;
        }
        res.send(card);
      })
      .catch((err) => res.status(NOT_FOUND).send({ message: `Карточки с таким ID нет. Подробнее:${err.message}` }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный ID карты' });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail()
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND).send({ message: 'Карточки с таким ID нет' });
          return;
        }
        res.send(card);
      })
      .catch((err) => res.status(NOT_FOUND).send({ message: `Карточки с таким ID нет. Подробнее:${err.message}` }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный ID карты' });
  }
};
