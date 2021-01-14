const express = require('express');

const router = express.Router();

const {
  getAll,
  create,
  delete: currentDelete,
} = require('../../controllers/star.controller');

// @route   GET api/restaurantManager/star?q=1
// @desc    Lấy danh sách stars
// @access  Private
router.get('/', getAll);

// @route   GET api/restaurantManager/star?q=1
// @desc    Tạo mới star
// @access  Private
router.post('/create/:userId', create);

// @route   GET api/restaurantManager/delete
// @desc    Xóa star
// @access  Private
router.get('/delete/:starId', currentDelete);

module.exports = router;
