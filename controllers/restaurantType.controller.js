const RestaurantType = require('../models/RestaurantType');

const Response = require('../helpers/response.helper');

exports.getAll = async (req, res, next) => {
  try {
    const restaurantTypes = await RestaurantType.find();
    return Response.success(res, { restaurantTypes });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
