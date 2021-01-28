const express = require('express');

const router = express.Router();

const {
  getAllByRestaurantManager,
  complete,
  updateByRestaurantManager,
  deleteByRestaurantManager,
  getCTBill,
  thongKeByMonth,
  thongKeByYear,
} = require('../../controllers/bill.controller');

// @route   GET api/restaurantManager/bill?q=1
// @desc    Lấy danh sách hóa đơn
// @access  Private
router.get('/', getAllByRestaurantManager);

// @route   GET api/restaurantManager/bill/:billId
// @desc    Lấy chi tiết của 1 hóa đơn cụ thể
// @access  Private
router.get('/:billId', getCTBill);

// @route   GET api/restaurantManager/bill/complete/${billId}?q='đang xử lý', 'đã xác nhận', 'đã hủy', 'đã thanh toán'
// @desc    Đã xác nhận hóa đơn
// @access  Private
router.get('/complete/:billId', complete);

// @route   GET api/restaurantManager/bill/update/${ctBillId}?soLuong=
// @desc    Cập nhật món ăn trong hóa đơn
// @access  Private
router.post('/update/:billId', updateByRestaurantManager);

// @route   GET api/restaurantManager/bill/delete/${ctBillId}
// @desc    Xóa món ăn trong hóa đơn
// @access  Private
router.get('/delete/:ctBillId', deleteByRestaurantManager);

// @route   GET api/restaurantManager/bill/thongKe/nam?q=
// @desc    Thống kê theo năm
// @access  Private
router.get('/thongKe/nam', thongKeByYear);

// @route   GET api/restaurantManager/bill/thongKe/thang?year=&&month=
// @desc    Thống kê theo tháng
// @access  Private
router.get('/thongke/thang', thongKeByMonth);

module.exports = router;
