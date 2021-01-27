const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const {
  findByUser,
  create,
  getAllByUser,
  update,
  delete: currentDelete,
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

// @route   POST api/restaurantManager/food/update
// @desc    Tạo món mới
// @access  Private
router.post('/update/:foodId', upload.single('hinhAnh'), update);

// @route   POST api/restaurantManager/food/delete
// @desc    Xóa món ăn
// @access  Private
router.get('/delete/:foodId', currentDelete);

module.exports = router;
