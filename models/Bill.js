const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  isCompleted: {
    type: Boolean,
    default: false,
  },
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

const Bill = mongoose.model('Bill', BillSchema, 'bills');
module.exports = Bill;
