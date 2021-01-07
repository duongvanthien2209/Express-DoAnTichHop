// Models
const Restaurant = require('../models/Restaurant');

const Response = require('../helpers/response.helper');

exports.getAll = async (req, res, next) => {
  let { q } = req.query;
  try {
    q = parseInt(q, 10);
    const limit = 20;
    const restaurants = await Restaurant.find()
      .skip(q * limit)
      .limit(limit);

    if (!restaurants) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { restaurants });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
