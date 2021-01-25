const express = require('express');

const router = express.Router();

const {
  create,
  delete: currentDelete,
  datMon,
  update,
  getAllByUser,
} = require('../../controllers/cart.controller');

// @route   GET api/user/cart/getAll
// @desc    Lấy món ăn theo người dùng
// @access  Private
router.get('/getAll', getAllByUser);

// @route   GET api/user/cart/create?soLuong=
// @desc    Thêm món ăn vào giỏ hàng
// @access  Private
router.get('/create/:foodId', create);

// @route   GET api/user/cart/update/${cartId}?soLuong=
// @desc    Cập nhật lại món ăn trong giỏ hàng
// @access  Private
router.get('/update/:cartId', update);

// @route   GET api/user/cart/delete
// @desc    xóa món ăn trong giỏ hàng
// @access  Private
router.get('/delete/:cartId', currentDelete);

// @route   GET api/user/cart/datMon
// @desc    Đặt món
// @access  Private
router.get('/datMon', datMon);

module.exports = router;
