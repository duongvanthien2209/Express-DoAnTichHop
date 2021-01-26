// const CTBill = require('../models/CTBill');

// const Response = require('../helpers/response.helper');

// exports.updateSoLuong = async (req, res, next) => {
//   const {
//     params: { ctBillId },
//     query: { soLuong },
//   } = req;

//   try {
//     const ctBill = await CTBill.findById(ctBillId);
//     if (!ctBill) throw new Error('Có lỗi xảy ra');
//     ctBill.soLuong = parseInt(soLuong, 10);
//     await ctBill.save();
//     return Response.success(res, { message:  })
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// };
