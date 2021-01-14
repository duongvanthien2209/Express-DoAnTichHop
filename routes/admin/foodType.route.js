/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();
const { getAll } = require('../../controllers/foodType.controller');

// @route   POST api/restaurantManager/foodType?q=1
// @desc    Tạo món mới
// @access  Private
router.get('/', getAll);

module.exports = router;
