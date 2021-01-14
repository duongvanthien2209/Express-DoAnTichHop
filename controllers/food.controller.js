/* eslint-disable no-underscore-dangle */
const fs = require('fs-promise');

const cloudinary = require('../config/cloudinaryConfig');

const FoodType = require('../models/FoodType');
// const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

const Response = require('../helpers/response.helper');

const limit = 20;

exports.getAllByUser = async (req, res, next) => {
  let { q } = req.query;
  const { restaurantManager: restaurant } = req;

  try {
    q = parseInt(q, 10);

    const total = await Food.find({ nhaHang: restaurant._id }).count();

    const foods = await Food.find({ nhaHang: restaurant._id })
      .populate('loai')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foods) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { foods, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAll = async (req, res, next) => {
  let { q } = req.query;

  try {
    q = parseInt(q, 10);

    const total = await Food.find().count();

    const foods = await Food.find()
      .populate('nhaHang')
      .populate('loai')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foods) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { foods, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.find = async (req, res, next) => {
  let { q } = req.query;
  const { name } = req.query;

  try {
    q = parseInt(q, 10);

    const total = await Food.find({
      $where: `this.tenMon.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    }).count();

    const foods = await Food.find({
      $where: `this.tenMon.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    })
      .populate('nhaHang')
      .populate('loai')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foods) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { foods, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.findByUser = async (req, res, next) => {
  let { q } = req.query;
  const { name } = req.query;
  const { restaurantManager: restaurant } = req;

  try {
    q = parseInt(q, 10);

    const total = await Food.find({
      $and: {
        $where: `this.tenMon.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
        nhaHang: restaurant._id,
      },
    }).count();

    const foods = await Food.find({
      $and: {
        $where: `this.tenMon.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
        nhaHang: restaurant._id,
      },
    })
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foods) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { foods, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  const {
    file,
    body: { tenMon, moTa, gia, loai },
    restaurantManager: restaurant,
  } = req;

  try {
    const foodType = await FoodType.findById(loai);

    if (!foodType) throw new Error('Có lỗi xảy ra');

    // const restaurant = await Restaurant.findById(nhaHang);

    // if (!restaurant) throw new Error('Có lỗi xảy ra');

    let orgName = file.originalname || '';
    orgName = orgName.trim().replace(/ /g, '-');
    const fullPathInServ = file.path;
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.rename(fullPathInServ, newFullPath);

    const result = await cloudinary.uploader.upload(newFullPath);

    fs.unlinkSync(newFullPath);

    const food = await Food.create({
      tenMon,
      moTa,
      gia,
      hinhAnh: result.url,
      loai: foodType._id,
      nhaHang: restaurant._id,
    });

    return Response.success(res, { food });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
