/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const Cart = require('../models/Cart');
const Food = require('../models/Food');

const Response = require('../helpers/response.helper');
const CTBill = require('../models/CTBill');
const Bill = require('../models/Bill');

exports.create = async (req, res, next) => {
  const {
    user,
    params: { foodId },
    body: { soLuong },
  } = req;

  try {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Có lỗi xảy ra');

    const cart = await Cart.create({
      soLuong,
      khachHang: user._id,
      monAn: food._id,
    });

    return Response.success(res, { cart });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.datMon = async (req, res, next) => {
  const { user } = req;

  try {
    const carts = await Cart.find({ khachHang: user._id }).populate('monAn');
    if (!carts) throw new Error('Có lỗi xảy ra');

    const bills = [];
    for (const cart of carts) {
      let bill = bills.find((item) => item.nhaHang === cart.monAn.nhaHang);
      if (!bill) {
        bill = await Bill.create({
          khachHang: user._id,
          nhaHang: cart.monAn.nhaHang,
        });
        bills.push(bill);
      }

      await CTBill.create({
        hoaDon: bill._id,
        monAn: cart.monAn._id,
        soLuong: cart.soLuong,
      });
    }

    return Response.success(res, { message: 'Đặt món thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { cartId },
  } = req;

  try {
    const cart = await Cart.findById(cartId);
    if (cart) throw new Error('Có lỗi xảy ra');

    await Cart.findByIdAndDelete(cartId);

    return Response.success(res, { message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
