const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const Response = require('../../helpers/response.helper');
const sendEmail = require('../../utils/sendEmail');

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    if (name !== process.env.ADMIN_NAME)
      return next(new Error('Sai tên đăng nhập.'));

    const result = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);

    if (!result) return next(new Error('Bạn nhập sai mật khẩu.'));

    const payload = {
      admin: {
        name,
        password,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) return next(err);
        return Response.success(res, { token });
      },
    );

    return true;
  } catch (error) {
    console.log(error);
    return next(new Error('Có lỗi xảy ra'));
  }
};

exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  if (email !== process.env.ADMIN_EMAIL)
    return next(new Error('Email không chính xác'));

  // Create password reset token
  const resetToken = crypto.randomBytes(16).toString('hex');

  process.env.ADMIN_RESETTOKEN = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  try {
    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      'host',
    )}/admin/confirmationForgotPassword/${resetToken}">${
      req.protocol
    }://${req.get('host')}/admin/confirmationForgotPassword/${resetToken}</a>`;

    const message = `<p>Bạn cần truy cập vào link sau để xác nhận tài khoản:</p><p>${tokenUrl}</p>`;
    await sendEmail({
      email,
      subject: 'Forgot Password - Admin',
      message,
    });

    return Response.success(res, {
      message: 'Email reset password đã được gởi',
      token: resetToken,
    });
  } catch (error) {
    console.log(error);
    process.env.ADMIN_RESETTOKEN = '';
    return next(new Error('Có lỗi xảy ra'));
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

  if (resetToken !== process.env.ADMIN_RESETTOKEN)
    return next(new Error('Reset token không hợp lệ'));

  try {
    const salt = await bcrypt.genSalt(10);
    process.env.ADMIN_PASSWORD = await bcrypt.hash(req.body.password, salt);

    const payload = {
      admin: {
        name: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) return next(err);
        return Response.success(res, { token });
      },
    );

    return true;
  } catch (error) {
    console.log(error);
    return next(new Error('Có lỗi xảy ra'));
  }
};
