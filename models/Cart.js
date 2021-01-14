const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  khachHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  monAn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  soLuong: {
    type: Number,
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Cart = mongoose.model('Cart', CartSchema, 'carts');
module.exports = Cart;
