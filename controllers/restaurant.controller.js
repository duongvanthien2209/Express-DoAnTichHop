// Models
const Restaurant = require('../models/Restaurant');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getCounter = async (req, res, next) => {
  try {
    const counter = await Restaurant.find().count();

    if (!counter) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { counter, limit });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAll = async (req, res, next) => {
  let { q } = req.query;
  try {
    q = parseInt(q, 10);

    const total = await Restaurant.find().count();

    const restaurants = await Restaurant.find()
      .skip((q - 1) * limit)
      .limit(limit);

    if (!restaurants) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { restaurants, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.find = async (req, res, next) => {
  let { q } = req.query;
  const { name } = req.query;
  try {
    // const restaurants = await Restaurant.find({
    //   tenNhaHang: new RegExp(`^${name}`),
    // });

    q = parseInt(q, 10);

    const total = await Restaurant.find({
      $where: `this.tenNhaHang.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    }).count();

    const restaurants = await Restaurant.find({
      $where: `this.tenNhaHang.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    })
      .skip((q - 1) * limit)
      .limit(limit);

    if (!restaurants) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { restaurants, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
