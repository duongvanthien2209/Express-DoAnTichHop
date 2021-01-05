const express = require('express');
const { check } = require('express-validator');

const {
  register,
  confirmationEmail,
  login,
} = require('../../controllers/restaurantManager/auth.controller');

const router = express.Router();

// @route   POST api/restaurantManager/auth/register
// @desc    Đăng ký
// @access  Public
router.post(
  '/register',
  [
    check('tenNhaHang', 'Bạn phải nhập tên cửa hàng').not().isEmpty(),
    check('email', 'Email phải đúng định dạng').isEmail(),
    check('name', 'Bạn phải nhập tên chủ cửa hàng').not().isEmpty(),
    check('password', 'Mật khẩu phải có ít nhất 8 ký tự').isLength({
      min: 8,
      max: 30,
    }),
    check('sdt', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('diaChi', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('loaiHinh', 'Bạn phải nhập loại cửa hàng').not().isEmpty(),
  ],
  register,
);

// @route   POST api/restaurantManager/auth/confirmationEmail
// @desc    Xác thực tài khoản
// @access  Public
router.get('/confirmationEmail/:token', confirmationEmail);

// @route   POST api/restaurantManager/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check(
      'password',
      'Mật khẩu phải có ít nhất 8 ký tự và không quá 30 ký tự',
    ).isLength({ min: 8, max: 30 }),
  ],
  login,
);

module.exports = router;
