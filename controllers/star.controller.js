/* eslint-disable no-underscore-dangle */
const Star = require('../models/Star');
const User = require('../models/User');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAll = async (req, res, next) => {
  const { restaurantManager } = req;
  let {
    query: { q },
  } = req;

  try {
    q = parseInt(q, 10);

    const total = await Star.find({
      nhaHang: restaurantManager._id,
    })
      .skip((q - 1) * limit)
      .limit(limit)
      .count();

    const stars = await Star.find({
      nhaHang: restaurantManager._id,
    })
      .populate('khachHang')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!stars) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { stars, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  const {
    body: { soLuong },
    params: { userId },
    restaurantManager,
  } = req;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Có lỗi xảy ra');

    const star = await Star.create({
      soLuong,
      nhaHang: restaurantManager._id,
      khachHang: user._id,
    });

    return Response.success(res, { star });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { starId },
  } = req;

  try {
    await Star.findByIdAndDelete(starId);

    return Response.success(res, { message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
