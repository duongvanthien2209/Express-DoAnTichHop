const FoodType = require('../models/FoodType');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAllFoodType = async (req, res, next) => {
  try {
    const foodTypes = await FoodType.find();
    if (!foodTypes) throw new Error('Có lỗi xảy ra');
    return Response.success(res, { foodTypes });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

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

exports.create = async (req, res, next) => {
  const { tenLoai } = req;

  try {
    let foodType = await FoodType.findOne({ tenLoai });
    if (foodType) throw new Error('Tên loại món ăn đã tồn tại');
    foodType = await FoodType.create({ tenLoai });
    return Response.success(res, { foodType });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
