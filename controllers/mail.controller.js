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
    const mails = await Mail.find({ nhaHang: restaurantManager._id })
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
