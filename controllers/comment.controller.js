/* eslint-disable no-underscore-dangle */
const Comment = require('../models/Comment');
const Food = require('../models/Food');
// const User = require('../models/User');

const Response = require('../helpers/response.helper');

const limit = 20;

// Lấy tất cả comment cho tất cả món ăn của nhà hàng
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

    const total = await Comment.find({
      monAn: { $in: foods },
    }).count();

    const comments = await Comment.find({
      monAn: { $in: foods },
    })
      .sort({ dateCreate: -1 })
      .populate('monAn')
      .populate('khachHang')
      .skip((q - 1) * limit)
      .limit(limit);
    if (!comments) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { comments, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Bình luận cho món ăn -> bằng quyền user
exports.create = async (req, res, next) => {
  const {
    params: { foodId },
    user,
    body: { text },
  } = req;

  try {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Có lỗi xảy ra');
    const comment = await Comment.create({
      chiTiet: text,
      monAn: food._id,
      khachHang: user._id,
    });

    return Response.success(res, { comment });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { commentId },
  } = req;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error('Có lỗi xảy ra');

    await Comment.findByIdAndDelete(commentId);

    return Response.success(res, {
      comment: await Comment.findById(commentId),
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
