const express = require('express');

const router = express.Router();
// const multer = require('multer');

// const upload = multer({ dest: 'public/uploads/' });

const { getAll, find } = require('../../controllers/food.controller');

// @route   GET api/admin/food/all?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAll);

// @route   GET api/admin/food/find/all?q=1&name=''
// @desc    Tìm món ăn
// @access  Private
router.get('/find', find);

module.exports = router;
