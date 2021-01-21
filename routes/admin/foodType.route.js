/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();
const { getAll, create } = require('../../controllers/foodType.controller');

// @route   GET api/restaurantManager/foodType?q=1
// @desc    Lấy danh sách loại món ăn
// @access  Private
router.get('/', getAll);

// @route   POST api/restaurantManager/foodType/create
// @desc    Tạo món mới
// @access  Private
router.post('/create', create);

module.exports = router;
