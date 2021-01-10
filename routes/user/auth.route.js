const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

const {
  login,
  register,
  getAll,
  find,
} = require('../../controllers/user/auth.controller');

// @route   POST api/user/auth
// @desc    Danh sách người dùng
// @access  Public
router.get('/', getAll);

// @route   POST api/user/auth/find
// @desc    Tìm kiếm người dùng
// @access  Public
router.get('/find', find);

// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('name', 'Bạn phải nhập tên đăng nhập').not().isEmpty(),
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
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
  ],
  register,
);

module.exports = router;
