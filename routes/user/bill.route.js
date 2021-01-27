const express = require('express');

const router = express.Router();
const {
  getAllByUser,
  getAllByUserCompleted,
  getCTBill,
  complete,
  addFoodToBill,
} = require('../../controllers/bill.controller');

// @route   GET api/user/bill/dat1Mon/:foodId?soLuong=1,2,3,..
// @desc    Lấy danh sách hóa đơn đã thanh toán, đã hủy
// @access  Private
router.get('/dat1Mon/:foodId', addFoodToBill);

// @route   GET api/user/bill/completed
// @desc    Lấy danh sách hóa đơn đã thanh toán, đã hủy
// @access  Private
router.get('/completed', getAllByUserCompleted);

// @route   GET api/user/bill/update/:billId?q='đang xử lý', 'đã xác nhận', 'đã hủy', 'đã thanh toán'
// @desc    Lấy danh sách hóa đơn đã thanh toán, đã hủy
// @access  Private
router.get('/update', complete);

// @route   GET api/user/bill
// @desc    Lấy danh sách hóa đơn đang xử lý, đã xác nhận
// @access  Private
router.get('/', getAllByUser);

// @route   GET api/user/bill/:billId
// @desc    Lấy chi tiết của 1 hóa đơn cụ thể
// @access  Private
router.get('/:billId', getCTBill);

module.exports = router;
