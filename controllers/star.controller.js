/* eslint-disable no-underscore-dangle */
const Star = require('../models/Star');
// const User = require('../models/User');
const Food = require('../models/Food');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAll = async (req, res, next) => {
  const { restaurantManager } = req;
  let {
    query: { q },
  } = req;

  try {
    q = parseInt(q, 10);

    let foods = await Food.find({ nhaHang: restaurantManager._id });
    if (!foods) throw new Error('Có lỗi xảy ra');
    foods = foods.map((food) => food._id);

    const total = await Star.find({
      monAn: { $in: foods },
    }).count();

    const stars = await Star.find({
      monAn: { $in: foods },
    })
      .sort({ dateCreate: -1 })
      .populate('monAn')
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
    params: { foodId },
    user,
  } = req;

  try {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Có lỗi xảy ra');

    const star = await Star.create({
      soLuong: parseInt(soLuong, 10),
      monAn: food._id,
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
    const star = await Star.findById(starId);
    if (!star) throw new Error('Có lỗi xảy ra');
    await Star.findByIdAndDelete(starId);

    return Response.success(res, { star: await Star.findById(starId) });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
