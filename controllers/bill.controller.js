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

exports.updateByRestaurantManager = async (req, res, next) => {
  let {
    query: { soLuong },
  } = req;
  const {
    params: { ctBillId },
  } = req;

  try {
    soLuong = parseInt(soLuong, 10);
    let ctBill = await CTBill.findById(ctBillId);
    if (!ctBill) throw new Error('Có lỗi xảy ra');

    ctBill = await CTBill.findByIdAndUpdate(ctBillId, { $set: { soLuong } });

    return Response.success(res, { ctBill });
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
    bill = await Bill.findByIdAndUpdate(billId, { $set: { isCompleted: q } });
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
