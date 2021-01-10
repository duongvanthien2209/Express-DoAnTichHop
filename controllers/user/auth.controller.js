/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const path = require('path');
const { validationResult } = require('express-validator');

// Models
const User = require('../../models/User');
const Token = require('../../models/Token');

const sendEmail = require('../../utils/sendEmail');
const Response = require('../../helpers/response.helper');

exports.login = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, password } = req.body;

  console.log(req.body);

  try {
    const user = await User.findOne({ name });

    if (!user) {
      throw new Error('Email chưa được đăng ký');
    }

    // Result: boolean
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error('Bạn nhập sai mật khẩu');
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return Response.success(res, { token });
      },
    );

    return true;
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.register = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error('Email đã tồn tại');
    }

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, salt),
    });

    // Tạo 1 token -> lưu lại -> gởi email + token -> email gởi lại token hợp lệ -> verified user
    const token = crypto.randomBytes(16).toString('hex');

    await Token.create({
      user: user._id,
      email,
      token: crypto.createHash('sha256').update(token).digest('hex'),
      tokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      'host',
    )}/api/auth/confirmation/${token}">${req.protocol}://${req.get(
      'host',
    )}/api/auth/confirmation/${token}</a>`;

    const message = `<p>Hello ${user.name},</p><p>Bạn cần truy cập vào link sau để xác nhận tài khoản:</p><p>${tokenUrl}</p>`;
    await sendEmail({
      email: user.email,
      subject: 'Account verification token',
      message,
    });

    return Response.success(res, { message: 'Tạo tài khoản thành công' });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};
