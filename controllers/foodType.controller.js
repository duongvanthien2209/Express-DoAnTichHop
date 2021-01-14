const FoodType = require('../models/FoodType');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAll = async (req, res, next) => {
  let { q } = req.query;

  try {
    q = parseInt(q, 10);
    const total = await FoodType.find().count();
    const foodTypes = await FoodType.find()
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foodTypes) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { foodTypes, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
