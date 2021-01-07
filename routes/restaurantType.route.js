const express = require('express');

const router = express.Router();

const { getAll } = require('../controllers/restaurantType.controller');

// @route   GET api/restaurantType
// @desc    Lấy dữ liệu
// @access  Public
router.get('/', getAll);

module.exports = router;
