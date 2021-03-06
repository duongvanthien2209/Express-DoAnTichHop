/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const fs = require('fs-promise');
const moment = require('moment');

const sendEmail = require('../../utils/sendEmail');
const Response = require('../../helpers/response.helper');
const cloudinary = require('../../config/cloudinaryConfig');
const { chuanHoa } = require('../../example');

// Models
const Restaurant = require('../../models/Restaurant');
const RestaurantType = require('../../models/RestaurantType');
const Token = require('../../models/Token');
const Food = require('../../models/Food');
const Bill = require('../../models/Bill');

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
        Response.success(res, { token, restaurantManager: restaurant });
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

exports.update = async (req, res, next) => {
  const {
    file,
    restaurantManager,
    body: { email, name, sdt, diaChi, loaiHinh },
  } = req;

  try {
    const restaurantType = await RestaurantType.findById(loaiHinh);
    if (!restaurantType) throw new Error('Có lỗi xảy ra');

    // const restaurant = await Restaurant.findOne({ $and: [ { email }, { _id:  } ] });
    // if(restaurant) throw new Error('Email ')

    if (file) {
      let orgName = file.originalname || '';
      orgName = orgName.trim().replace(/ /g, '-');
      const fullPathInServ = file.path;
      const newFullPath = `${fullPathInServ}-${orgName}`;
      fs.rename(fullPathInServ, newFullPath);

      const result = await cloudinary.uploader.upload(newFullPath);
      fs.unlinkSync(newFullPath);

      await Restaurant.findByIdAndUpdate(restaurantManager._id, {
        $set: {
          email,
          name,
          tenNhaHang: chuanHoa(name),
          SDT: sdt,
          diaChi,
          loaiHinh: restaurantType,
          hinh: result.url,
        },
      });
    } else {
      await Restaurant.findByIdAndUpdate(restaurantManager._id, {
        $set: {
          email,
          name,
          tenNhaHang: chuanHoa(name),
          SDT: sdt,
          diaChi,
          loaiHinh: restaurantType,
          // hinh: result.url,
        },
      });
    }

    return Response.success(res, {
      restaurant: await Restaurant.findById(restaurantManager._id),
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.thongKe = async (req, res, next) => {
  const { restaurantManager } = req;

  try {
    const now = moment();
    const foodTotal = await Food.find({
      nhaHang: restaurantManager._id,
    }).count();

    const dangXuLyBills = await Bill.find({
      $and: [{ nhaHang: restaurantManager._id }, { isCompleted: 'đang xử lý' }],
    });
    const daXacNhanBills = await Bill.find({
      $and: [
        { nhaHang: restaurantManager._id },
        { isCompleted: 'đã xác nhận' },
      ],
    });
    const daHuyBills = await Bill.find({
      $and: [{ nhaHang: restaurantManager._id }, { isCompleted: 'đã hủy' }],
    });
    const daThanhToanBills = await Bill.find({
      $and: [
        { nhaHang: restaurantManager._id },
        { isCompleted: 'đã thanh toán' },
      ],
    });

    const dangXuLyBillsTotal = dangXuLyBills.filter((dangXuLyBill) => {
      const ngay = moment(dangXuLyBill.dateCreate);
      return (
        ngay.month() === now.month() &&
        ngay.year() === now.year() &&
        ngay.date() === now.date()
      );
    }).length;

    const daXacNhanBillsTotal = daXacNhanBills.filter((daXacNhanBill) => {
      const ngay = moment(daXacNhanBill.dateCreate);
      return (
        ngay.month() === now.month() &&
        ngay.year() === now.year() &&
        ngay.date() === now.date()
      );
    }).length;

    const daHuyBillsTotal = daHuyBills.filter((daHuyBill) => {
      const ngay = moment(daHuyBill.dateCreate);
      return (
        ngay.month() === now.month() &&
        ngay.year() === now.year() &&
        ngay.date() === now.date()
      );
    }).length;

    let tong = 0;
    const daThanhToanBillsTotal = daThanhToanBills.filter((daThanhToanBill) => {
      const ngay = moment(daThanhToanBill.dateCreate);
      if (
        ngay.month() === now.month() &&
        ngay.year() === now.year() &&
        ngay.date() === now.date()
      ) {
        tong += daThanhToanBill.total;
        return true;
      }
      return false;
    }).length;

    return Response.success(res, {
      foodTotal,
      daHuyBillsTotal,
      daXacNhanBillsTotal,
      dangXuLyBillsTotal,
      daThanhToanBillsTotal,
      total: tong,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
