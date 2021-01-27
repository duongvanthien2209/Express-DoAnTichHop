const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const {
  login,
  forgotPassword,
  resetPassword,
  thongKe,
} = require('../../controllers/admin/auth.controller');

// @route   POST api/admin/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('name', 'Bạn phải nhập tên').not().isEmpty(),
    check(
      'password',
      'Mật khẩu phải có ít nhất 8 ký tự và không quá 30 ký tự',
    ).isLength({ min: 8, max: 30 }),
  ],
  login,
);

// @route   POST api/admin/auth/forgotPassword
// @desc    Quên mật khẩu
// @access  Public
router.post(
  '/forgotPassword',
  [check('email', 'Bạn phải nhập đúng định dạng email').isEmail()],
  forgotPassword,
);

// @route   POST api/admin/auth/resetPassword
// @desc    Reset mật khẩu
// @access  Public
router.post(
  '/resetPassword/:resetToken',
  [
    check(
      'password',
      'Mật khẩu phải có ít nhất 8 ký tự và không quá 30 ký tự',
    ).isLength({ min: 8, max: 30 }),
  ],
  resetPassword,
);

// @route   POST api/admin/auth/thongKe
// @desc    Reset mật khẩu
// @access  Public
router.get('/thongKe', thongKe);

module.exports = router;
