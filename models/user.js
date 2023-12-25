const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator(v) {
        return /^https?:\/\//.test(v);
      },
      message: 'URL должен начинаться с https://',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
