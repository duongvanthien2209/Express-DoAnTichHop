const express = require('express');

const router = express.Router();

const {
  create,
  delete: currentDelete,
  datMon,
} = require('../../controllers/cart.controller');

// @route   POST api/user/cart/create
// @desc    Thêm món ăn vào giỏ hàng
// @access  Private
router.post('/create/:foodId', create);

// @route   POST api/user/cart/delete
// @desc    Thêm món ăn trong giỏ hàng
// @access  Private
router.get('/delete/:cartId', currentDelete);

// @route   GET api/user/cart/datMon
// @desc    Đặt món
// @access  Private
router.get('/datMon', datMon);

module.exports = router;
