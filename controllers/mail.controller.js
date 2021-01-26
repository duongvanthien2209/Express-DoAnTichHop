/* eslint-disable no-underscore-dangle */
const Mail = require('../models/Mail');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAllByUser = async (req, res, next) => {
  let {
    query: { q },
  } = req;
  const { user } = req;

  try {
    q = parseInt(q, 10);
    const mails = await Mail.find({ khachHang: user._id })
      .skip((q - 1) * limit)
      .limit(limit)
      .sort({
        dateCreate: -1,
      });

    if (!mails) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { mails });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllByRestaurantManager = async (req, res, next) => {
  let {
    query: { q },
  } = req;
  const { restaurantManager } = req;

  try {
    q = parseInt(q, 10);
    const total = await Mail.find({ nhaHang: restaurantManager._id }).count();
    const mails = await Mail.find({ nhaHang: restaurantManager._id })
      .skip((q - 1) * limit)
      .limit(limit)
      .sort({
        dateCreate: -1,
      });

    if (!mails) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { mails, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Lấy các tin nhắn chưa đọc
exports.getAllByRestaurantManager1 = async (req, res, next) => {
  const { restaurantManager } = req;

  try {
    const mails = await Mail.find({
      $and: [{ nhaHang: restaurantManager._id }, { isWatched: false }],
    }).sort({
      dateCreate: -1,
    });

    if (!mails) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { mails });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllByAdmin = async (req, res, next) => {
  let {
    query: { q },
  } = req;

  try {
    q = parseInt(q, 10);

    const mails = await Mail.find({ isAdmin: true })
      .skip((q - 1) * limit)
      .limit(limit)
      .sort({
        dateCreate: -1,
      });

    if (!mails) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { mails });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updateReaded = async (req, res, next) => {
  const {
    params: { mailId },
  } = req;

  try {
    const mail = await Mail.findById(mailId);
    if (!mail) throw new Error('Có lỗi xảy ra');
    await Mail.findByIdAndUpdate(mailId, { $set: { isWatched: true } });
    return Response.success(res, { mail: await await Mail.findById(mailId) });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
