/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const Bill = require('../models/Bill');

const Response = require('../helpers/response.helper');
const CTBill = require('../models/CTBill');

const limit = 20;

exports.getAllByRestaurantManager = async (req, res, next) => {
  let {
    query: { q },
  } = req;
  const { restaurantManager } = req;

  try {
    q = parseInt(q, 10);

    const total = await Bill.find({ nhaHang: restaurantManager._id }).count();
    const bills = await Bill.find({ nhaHang: restaurantManager._id })
      .populate('khachHang')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!bills) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { bills, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllByUser = async (req, res, next) => {
  const { user } = req;

  try {
    // Tổng tất cả hóa đơn của khách hàng đó
    const total = await Bill.find({ khachHang: user._id }).count();
    const bills = await Bill.find({
      $and: [
        { khachHang: user._id },
        { isCompleted: { $in: ['đang xử lý', 'đã xác nhận'] } },
      ],
    }).populate('nhaHang');

    if (!bills) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { bills, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllByUserCompleted = async (req, res, next) => {
  const { user } = req;

  try {
    // Tổng tất cả hóa đơn của khách hàng đó
    const total = await Bill.find({ khachHang: user._id }).count();
    const bills = await Bill.find({
      $and: [
        { khachHang: user._id },
        { isCompleted: { $in: ['đã hủy', 'đã thanh toán'] } },
      ],
    }).populate('nhaHang');

    if (!bills) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { bills, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getCTBill = async (req, res, next) => {
  const {
    params: { billId },
  } = req;

  try {
    const bill = await Bill.findById(billId).populate('nhaHang');
    if (!bill) throw new Error('Có lỗi xảy ra');

    const bills = await CTBill.find({ hoaDon: bill._id }).populate('monAn');
    if (!bills) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { bill, CTBills: bills });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updateByRestaurantManager = async (req, res, next) => {
  const {
    params: { billId },
    body: { ctBills },
  } = req;

  try {
    let total = 0;
    for (const item of ctBills) {
      const ctBill = await CTBill.findByIdAndUpdate(item.id, {
        $set: { soLuong: item.soLuong },
      }).populate('monAn');
      if (!ctBill) throw new Error('Có lỗi xảy ra');
      total += ctBill.monAn.gia * item.soLuong;
    }
    const bill = await Bill.findByIdAndUpdate(billId, {
      $set: { total, isCompleted: 'đã xác nhận' },
    }).populate('khachHang');
    return Response.success(res, { total, bill });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Cập nhật lại
exports.complete = async (req, res, next) => {
  const {
    params: { billId },
    query: { q },
  } = req;

  try {
    let bill = await Bill.findById(billId);
    if (!bill) throw new Error('Có lỗi xảy ra');
    bill = await Bill.findByIdAndUpdate(billId, {
      $set: { isCompleted: q },
    }).populate('khachHang');
    return Response.success(res, { bill });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Xóa chi tiết hóa đơn - Không có xóa hóa đơn, chỉ có cập nhật lại trạng thái hóa đơn
exports.deleteByRestaurantManager = async (req, res, next) => {
  const {
    params: { ctBillId },
  } = req;

  try {
    const ctBill = await CTBill.findById(ctBillId);
    if (!ctBill) throw new Error('Có lỗi xảy ra');

    await CTBill.findByIdAndDelete(ctBillId);

    return Response.success(res, { message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
