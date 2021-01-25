/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const Cart = require('../models/Cart');
const Food = require('../models/Food');
const Mail = require('../models/Mail');

const Response = require('../helpers/response.helper');
const CTBill = require('../models/CTBill');
const Bill = require('../models/Bill');

const { io } = require('../helpers/handleSocketIo.helper');

exports.getAllByUser = async (req, res, next) => {
  const { user } = req;

  try {
    const carts = await Cart.find({ khachHang: user._id });
    if (!carts) throw new Error('Có lỗi xảy ra');

    for (const cart of carts) {
      const food = await Food.findById(cart.monAn).populate('nhaHang');
      cart.monAn = food;
    }

    return Response.success(res, { carts });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  let {
    query: { soLuong },
  } = req;
  const {
    user,
    params: { foodId },
  } = req;

  try {
    soLuong = parseInt(soLuong, 10);
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

exports.update = async (req, res, next) => {
  let {
    query: { soLuong },
  } = req;
  const {
    // user,
    params: { cartId },
  } = req;

  try {
    soLuong = parseInt(soLuong, 10);

    let cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Có lỗi xảy ra');

    cart = await Cart.findByIdAndUpdate(cartId, { $set: { soLuong } });

    return Response.success(res, { cart });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Đăt món xong -> gởi thông tin hóa đơn cho nhà hàng xử lý
exports.datMon = async (req, res, next) => {
  const { user } = req;

  try {
    const carts = await Cart.find({ khachHang: user._id }).populate('monAn');
    if (!carts) throw new Error('Có lỗi xảy ra');

    const bills = [];
    for (const cart of carts) {
      let bill = bills.find(
        (item) => item.nhaHang.toString() === cart.monAn.nhaHang.toString(),
      );
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

      // Cập nhật lại tổng tiền của hóa đơn
      bill.total += cart.soLuong * cart.monAn.gia;
      await bill.save();

      // Xóa các món ăn đã đặt trong giỏ hàng
      await cart.delete();
    }

    // Gửi thông báo đến nhà hàng
    for (const bill of bills) {
      // Tạo thư mới của nhà hàng đó
      await Mail.create({
        text: bill.id,
        nhaHang: bill.nhaHang,
      });

      io.to(bill.nhaHang.toString()).emit(
        'billMessage',
        'Có yêu cầu từ khách hàng, check hóa đơn!',
      );
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
