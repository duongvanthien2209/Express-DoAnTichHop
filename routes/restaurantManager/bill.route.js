const express = require('express');

const router = express.Router();

const {
  getAll,
  complete,
  delete: currentDelete,
} = require('../../controllers/bill.controller');

// @route   GET api/restaurantManager/bill?q=1
// @desc    Lấy danh sách hóa đơn
// @access  Private
router.get('/', getAll);

// @route   GET api/restaurantManager/bill/complete
// @desc    Đã thanh toán
// @access  Private
router.get('/complete/:billId', complete);

// @route   GET api/restaurantManager/bill/delete
// @desc    Đã thanh toán
// @access  Private
router.get('/delete/:billId', currentDelete);

module.exports = router;
