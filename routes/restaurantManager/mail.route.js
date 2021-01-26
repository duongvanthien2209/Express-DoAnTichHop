const express = require('express');

const router = express.Router();

const {
  getAllByRestaurantManager,
  getAllByRestaurantManager1,
  updateReaded,
} = require('../../controllers/mail.controller');

// @route   GET api/restaurantManager/mail?q=1
// @desc    Lấy danh sách các tin nhắn
// @access  Private
router.get('/', getAllByRestaurantManager);

// @route   GET api/restaurantManager/mail/update/:mailId
// @desc    Cập nhật đã đọc tin nhắn
// @access  Private
router.get('/update/:mailId', updateReaded);

// @route   GET api/restaurantManager/mail/notRead
// @desc    Lấy danh sách các tin nhắn chưa đọc
// @access  Private
router.get('/notRead', getAllByRestaurantManager1);

module.exports = router;
