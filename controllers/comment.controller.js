/* eslint-disable no-underscore-dangle */
const Comment = require('../models/Comment');
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

    const total = await Comment.find({
      nhaHang: restaurantManager._id,
    })
      .skip((q - 1) * limit)
      .limit(limit)
      .count();

    const comments = await Comment.find({
      nhaHang: restaurantManager._id,
    })
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

exports.create = async (req, res, next) => {
  const {
    params: { userId },
    restaurantManager,
    body: { text },
  } = req;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Có lỗi xảy ra');

    const comment = await Comment.create({
      chiTiet: text,
      nhahang: restaurantManager._id,
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
    await Comment.findByIdAndDelete(commentId);

    return Response.success(res, { message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
