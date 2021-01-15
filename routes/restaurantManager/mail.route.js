const express = require('express');

const router = express.Router();

const {
  getAllByRestaurantManager,
} = require('../../controllers/mail.controller');

// @route   GET api/restaurantManager/mail?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAllByRestaurantManager);

module.exports = router;
