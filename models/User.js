const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  SDT: {
    type: String,
    required: true,
  },

  diaChi: {
    type: String,
    required: true,
    unique: true,
  },

  ngaySinh: {
    type: Date,
    required: true,
  },

  avatar: {
    type: String,
    default: 'https://picsum.photos/200',
  },

  CMND: {
    type: String,
    required: true,
  },

  gioiTinh: {
    type: Boolean,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema, 'users');
