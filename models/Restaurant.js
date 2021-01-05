const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  tenNhaHang: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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
  SDT: {
    type: String,
    required: true,
  },
  diaChi: {
    type: String,
    required: true,
  },
  ngayLap: {
    type: Date,
    default: Date.now(),
  },
  loaiHinh: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantType',
    required: true,
  },
});

const Restaurant = mongoose.model(
  'Restaurant',
  RestaurantSchema,
  'restaurants',
);

module.exports = Restaurant;
