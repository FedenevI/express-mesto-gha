const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFounderError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForBiddenError');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFounderError('Карточки с таким ID нет'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFounderError(`Карточка с _id: ${req.params.cardId} не найдена.`))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Удалить карточку другого пользователя нельзя');
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFounderError(`Карточка с _id: ${req.params.cardId} не найдена.`));
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFounderError(`Карточки с таким ID: ${req.params.cardId} нет`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некоррекный ID: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFounderError(`Карточки с таким ID: ${req.params.cardId} нет`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некоррекный ID: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
