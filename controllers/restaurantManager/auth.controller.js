/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const sendEmail = require('../../utils/sendEmail');
const Response = require('../../helpers/response.helper');

// Models
const Restaurant = require('../../models/Restaurant');
const RestaurantType = require('../../models/RestaurantType');
const Token = require('../../models/Token');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      tenNhaHang,
      email,
      name,
      password,
      sdt,
      diaChi,
      loaiHinh,
    } = req.body;

    let restaurant = await Restaurant.findOne({ tenNhaHang });

    if (restaurant) throw new Error('Tên nhà hàng đã tồn tại');

    restaurant = await Restaurant.findOne({ email });

    if (restaurant) throw new Error('Email đã tồn tại');

    const restaurantType = await RestaurantType.findById(loaiHinh);

    if (!restaurantType) throw new Error('Loại hình không tồn tại');

    const salt = await bcrypt.genSalt(10);
    restaurant = await Restaurant.create({
      tenNhaHang,
      email,
      name,
      password: await bcrypt.hash(password, salt),
      SDT: sdt,
      diaChi,
      loaiHinh: restaurantType._id,
    });

    // Create a verification token for this user
    const token = crypto.randomBytes(16).toString('hex');

    await Token.create({
      restaurant: restaurant._id,
      email: restaurant.email,
      token: crypto.createHash('sha256').update(token).digest('hex'),
      tokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      'host',
    )}/api/restaurantManager/auth/confirmationEmail/${token}">${
      req.protocol
    }://${req.get(
      'host',
    )}/api/restaurantManager/auth/confirmationEmail/${token}</a>`;

    const message = `<p>Xin chao ${restaurant.tenNhaHang},</p><p>Bạn cần phải xác mình chủ cửa hàng bằng đường link sau:</p><p>${tokenUrl}</p>`;

    await sendEmail({
      email: restaurant.email,
      subject: 'Xác minh chủ cửa hàng',
      message,
    });

    return Response.success(res, { message: 'Bạn đã đăng ký thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.confirmationEmail = async (req, res) => {
  // Get hashed token
  const confirmationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const token = await Token.findOne({
      token: confirmationToken,
      tokenExpire: { $gt: Date.now() },
    });

    if (!token) throw new Error('Mã token không hợp lệ');

    await Restaurant.findByIdAndUpdate(token.restaurant, { isVerified: true });

    await Token.findByIdAndDelete(token._id);

    return res.send('Xác nhận thành công');
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) throw new Error('Email không tồn tại');

    const result = await bcrypt.compare(password, restaurant.password);

    if (!result) throw new Error('Sai mật khẩu');

    const payload = {
      restaurantManager: { id: restaurant.id },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        Response.success(res, { token });
      },
    );

    return true;
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) throw new Error('Email không tồn tại trong hệ thống.');

    // Create password reset token
    const resetToken = crypto.randomBytes(16).toString('hex');

    await Token.create({
      restaurant: restaurant._id,
      email,
      token: crypto.createHash('sha256').update(resetToken).digest('hex'),
      tokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      'host',
    )}/restaurantManager/confirmationForgotPassword/${resetToken}">${
      req.protocol
    }://${req.get(
      'host',
    )}/restaurantManager/confirmationForgotPassword/${resetToken}</a>`;

    const message = `<p>Bạn cần truy cập vào link sau để xác nhận tài khoản:</p><p>${tokenUrl}</p>`;
    await sendEmail({
      email,
      subject: 'Forgot Password - restaurantManager',
      message,
    });

    return Response.success(res, {
      message: 'Email reset password đã được gởi',
      token: resetToken,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const token = await Token.findOne({
      token: resetToken,
      tokenExpire: { $gt: Date.now() },
    });

    if (!token) throw new Error('Token không hợp lệ');

    // Cập nhật lại mật khẩu
    const salt = await bcrypt.genSalt(10);
    const restaurant = await Restaurant.findByIdAndUpdate(token.restaurant, {
      password: await bcrypt.hash(req.body.password, salt),
    });

    // Xóa token
    await Token.findByIdAndDelete(token._id);

    const payload = {
      restaurantManager: {
        id: restaurant.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, currentToken) => {
        if (err) return next(err);
        return Response.success(res, { currentToken });
      },
    );

    return true;
  } catch (error) {
    console.log(error);
    return next(new Error('Có lỗi xảy ra'));
  }
};
