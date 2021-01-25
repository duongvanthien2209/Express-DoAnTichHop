const express = require('express');

const router = express.Router();
const {
  getAllByUser,
  getAllByUserCompleted,
  getCTBill,
} = require('../../controllers/bill.controller');

// @route   GET api/user/bill
// @desc    Lấy danh sách hóa đơn đang xử lý, đã xác nhận
// @access  Private
router.get('/', getAllByUser);

// @route   GET api/user/bill/:billId
// @desc    Lấy chi tiết của 1 hóa đơn cụ thể
// @access  Private
router.get('/:billId', getCTBill);

// @route   GET api/user/bill/completed
// @desc    Lấy danh sách hóa đơn đã thanh toán, đã hủy
// @access  Private
router.get('/completed', getAllByUserCompleted);

module.exports = router;
