/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();
const {
  getAll,
  create,
  getAllFoodType,
} = require('../../controllers/foodType.controller');

// @route   GET api/restaurantManager/foodType/getAllFoodType
// @desc    Lấy danh sách tất cả các loại món ăn
// @access  Private
router.get('/getAllFoodType', getAllFoodType);

// @route   GET api/restaurantManager/foodType?q=1
// @desc    Lấy danh sách loại món ăn
// @access  Private
router.get('/', getAll);

// @route   POST api/restaurantManager/foodType/create
// @desc    Tạo món mới
// @access  Private
router.post('/create', create);

module.exports = router;
