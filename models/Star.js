const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
  soLuong: Number,
  nhaHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  khachHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Star = mongoose.model('Star', StarSchema, 'stars');
module.exports = Star;
