const mongoose = require('mongoose');

const CTBillSchema = new mongoose.Schema({
  soLuong: {
    type: Number,
    required: true,
  },
  monAn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  hoaDon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
});

const CTBill = mongoose.model('CTBill', CTBillSchema, 'CTBills');
module.exports = CTBill;
