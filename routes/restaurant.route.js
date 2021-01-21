const express = require('express');

const router = express.Router();

const {
  getAll,
  find,
  getCounter,
} = require('../controllers/restaurant.controller');

// @route   GET api/restaurantManager/restaurant?q=1
// @desc    Lấy danh sách nhà hàng - theo thứ tự mới -> cũ
// @access  Private
router.get('/', getAll);

// @route   GET api/restaurantManager/restaurant/counter
// @desc    Lấy số lượng tất cả cửa hàng
// @access  Private
router.get('/counter', getCounter);

// @route   GET api/restaurantManager/restaurant/find?name=''
// @desc    Tìm kiếm nhà hàng
// @access  Private
router.get('/find', find);

module.exports = router;
