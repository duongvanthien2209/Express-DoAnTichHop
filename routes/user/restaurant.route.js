const express = require('express');

const router = express.Router();

const { getByID } = require('../../controllers/restaurant.controller');

// @route   GET api/user/restaurant/:restaurantId
// @desc    Lấy thông tin chi tiết của nhà hàng
// @access  Private
router.get('/:restaurantId', getByID);

module.exports = router;
