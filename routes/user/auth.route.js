const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

const { login, register } = require('../../controllers/user/auth.controller');

// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Bạn phải nhập đúng định dạng email.').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 6 }),
  ],
  login,
);

// @route   POST api/admin/auth/register
// @desc    Đăng ký tài khoản
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 6 }),
  ],
  register,
);

module.exports = router;
