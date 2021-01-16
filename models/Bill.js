const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  // 'đang xử lý', 'đã xác nhận', 'đã hủy', 'đã thanh toán'
  isCompleted: {
    type: String,
    default: 'đang xử lý',
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
