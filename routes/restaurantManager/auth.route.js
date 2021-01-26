const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const {
  register,
  confirmationEmail,
  login,
  forgotPassword,
  resetPassword,
  update,
} = require('../../controllers/restaurantManager/auth.controller');

const { protect } = require('../../middlewares/restaurantManager/auth');

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

// @route   POST api/restaurantManager/auth/update
// @desc    Cập nhật thông tin nhà hàng
// @access  Private
router.post(
  '/update',
  [
    // check('tenNhaHang', 'Bạn phải nhập tên cửa hàng').not().isEmpty(),
    check('email', 'Email phải đúng định dạng').isEmail(),
    check('name', 'Bạn phải nhập tên chủ cửa hàng').not().isEmpty(),
    // check('password', 'Mật khẩu phải có ít nhất 8 ký tự').isLength({
    //   min: 8,
    //   max: 30,
    // }),
    check('sdt', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('diaChi', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('loaiHinh', 'Bạn phải nhập loại cửa hàng').not().isEmpty(),
  ],
  upload.single('hinhAnh'),
  protect,
  update,
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

// @route   POST api/restaurantManager/auth/forgotPassword
// @desc    Quên mật khẩu
// @access  Public
router.post(
  '/forgotPassword',
  [check('email', 'Bạn phải nhập đúng định dạng email').isEmail()],
  forgotPassword,
);

// @route   POST api/restaurantManager/auth/resetPassword
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

module.exports = router;
