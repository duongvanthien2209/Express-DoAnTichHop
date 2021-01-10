const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  tenMon: {
    type: String,
    required: true,
  },
  moTa: {
    type: String,
    required: true,
  },
  hinhAnh: {
    type: String,
    default: 'https://picsum.photos/200',
  },
  gia: {
    type: Number,
    required: true,
  },
  loai: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nhaHang: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Food = mongoose.model('Food', FoodSchema, 'foods');
module.exports = Food;
