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
    check('username', 'Bạn phải nhập tên đăng nhập').not().isEmpty(),
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
    check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('fullname', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('diaChi', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('SDT', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gioiTinh', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('CMND', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('ngaySinh', 'Bạn phải nhập ngày sinh').not().isEmpty(),
  ],
  register,
);

module.exports = router;
