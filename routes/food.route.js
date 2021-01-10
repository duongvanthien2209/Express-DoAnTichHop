const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const { getAll, find, create } = require('../controllers/food.controller');

// @route   POST api/restaurantManager/food/register
// @desc    Tạo món mới
// @access  Private
router.post('/register', upload.single('img'), create);

// @route   GET api/restaurantManager/food?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAll);

// @route   GET api/restaurantManager/food/find?q=1&name=''
// @desc    Tìm món ăn
// @access  Private
router.get('/find', find);

module.exports = router;
