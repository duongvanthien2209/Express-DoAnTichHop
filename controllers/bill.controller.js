/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const Bill = require('../models/Bill');

const Response = require('../helpers/response.helper');
const CTBill = require('../models/CTBill');

const limit = 20;

exports.getAll = async (req, res, next) => {
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

exports.complete = async (req, res, next) => {
  const {
    params: { billId },
  } = req;

  try {
    const bill = await Bill.findById(billId);
    if (!bill) throw new Error('Có lỗi xảy ra');
    if (!bill.isCompleted) bill.isCompleted = true;
    await bill.save();
    return Response.success(res, { bill });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { billId },
  } = req;

  try {
    const bill = await Bill.findById(billId);
    if (!bill) throw new Error('Có lỗi xảy ra');

    const ctBills = await CTBill.find({ hoaDon: bill._id });
    for (const ctBill of ctBills) {
      await CTBill.findByIdAndDelete(ctBill._id);
    }

    await Bill.findByIdAndDelete(billId);

    return Response.success(res, { message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
