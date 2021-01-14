const express = require('express');

const router = express.Router();

const {
  create,
  getAll,
  delete: currentDelete,
} = require('../../controllers/comment.controller');

// @route   GET api/restaurantManager/comment?q=1
// @desc    Lấy danh sách comments
// @access  Private
router.get('/', getAll);

// @route   POST api/restaurantManager/comment/create
// @desc    Tạo comment
// @access  Private
router.post('/create/:userId', create);

// @route   GET api/restaurantManager/comment/delete
// @desc    Xóa comment
// @access  Private
router.get('/delete/:commentId', currentDelete);

module.exports = router;
