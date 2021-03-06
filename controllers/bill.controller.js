/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const moment = require('moment');
const Bill = require('../models/Bill');

const Response = require('../helpers/response.helper');
const CTBill = require('../models/CTBill');
const Food = require('../models/Food');

const { io } = require('../helpers/handleSocketIo.helper');
const Mail = require('../models/Mail');

const limit = 20;

exports.addFoodToBill = async (req, res, next) => {
  const {
    params: { foodId },
    query: { soLuong },
    user,
  } = req;

  try {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Có lỗi xảy ra');

    const bill = await Bill.create({
      nhaHang: food.nhaHang,
      khachHang: user._id,
      total: food.gia * parseInt(soLuong, 10),
    });

    await CTBill.create({
      soLuong: parseInt(soLuong, 10),
      monAn: food._id,
      hoaDon: bill._id,
    });

    // Tạo thư mới của nhà hàng đó
    await Mail.create({
      text: `Hóa đơn của khác hàng: ${user.fullName}, mã hóa đơn: ${bill.id} đợi xác nhận`,
      nhaHang: bill.nhaHang,
    });

    io.to(bill.nhaHang.toString()).emit(
      'billMessage',
      'Có yêu cầu từ khách hàng, check hóa đơn!',
    );

    return Response.success(res, { bill });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllByRestaurantManager = async (req, res, next) => {
  let {
    query: { q },
  } = req;
  const { restaurantManager } = req;

  try {
    q = parseInt(q, 10);

    const total = await Bill.find({ nhaHang: restaurantManager._id }).count();
    const bills = await Bill.find({ nhaHang: restaurantManager._id })
      .sort({ dateCreate: -1 })
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
    })
      .sort({ dateCreate: -1 })
      .populate('nhaHang');

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
    })
      .sort({ dateCreate: -1 })
      .populate('nhaHang');

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

// Cập nhật lại -> bởi chủ cửa hàng
exports.complete = async (req, res, next) => {
  const {
    params: { billId },
    query: { q },
  } = req;

  try {
    let bill = await Bill.findById(billId);
    if (!bill) throw new Error('Có lỗi xảy ra');

    if (bill.isCompleted === 'đã hủy' || bill.isCompleted === 'đã thanh toán')
      throw new Error('Bạn không được phép thay đổi');

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

// Thống kê theo năm -> tổng tiền
exports.thongKeByYear = async (req, res, next) => {
  let {
    query: { q },
  } = req;

  try {
    q = parseInt(q, 10);
    let bills = await Bill.find({ isCompleted: 'đã thanh toán' });
    bills = bills.filter((bill) => moment(bill.dateCreate).year() === q);
    if (bills.length === 0) throw new Error('Không có doanh thu trong năm');

    const data = {};
    for (let i = 1; i <= 12; i++) {
      let tong = 0;
      for (const bill of bills) {
        if (moment(bill.dateCreate).month() === i - 1) tong += bill.total;
      }

      data[i] = tong;
    }

    return Response.success(res, { data });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Thống kê theo tháng -> ngày trong tháng
exports.thongKeByMonth = async (req, res, next) => {
  let {
    query: { year, month },
  } = req;

  try {
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    let bills = await Bill.find({ isCompleted: 'đã thanh toán' });
    bills = bills.filter((bill) => {
      const date = moment(bill.dateCreate);
      return date.year() === year && date.month() === month - 1;
    });
    if (bills.length === 0) throw new Error('Không có doanh thu trong tháng');

    console.log(`${year}-${month - 1 < 10 ? `0${month - 1}` : month - 1}`);

    const dayInMonth = moment(
      `${year}-${month < 10 ? `0${month}` : month}`,
      'YYYY-MM',
    ).daysInMonth();
    const data = {};
    for (let i = 1; i <= dayInMonth; i++) {
      let tong = 0;
      for (const bill of bills) {
        if (moment(bill.dateCreate).date() === i) tong += bill.total;
      }

      data[i] = tong;
    }

    return Response.success(res, { data });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
