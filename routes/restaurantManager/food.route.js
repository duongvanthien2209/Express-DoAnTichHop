const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const {
  findByUser,
  create,
  getAllByUser,
} = require('../../controllers/food.controller');

// @route   GET api/restaurantManager/food?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAllByUser);

// @route   POST api/restaurantManager/food/register
// @desc    Tạo món mới
// @access  Private
router.post('/register', upload.single('hinhAnh'), create);

// @route   GET api/restaurantManager/food/find?q=1&name=''
// @desc    Tìm món ăn
// @access  Private
router.get('/find', findByUser);

module.exports = router;
