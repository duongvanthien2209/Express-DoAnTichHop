const express = require('express');

const router = express.Router();

const { getAllByAdmin } = require('../../controllers/mail.controller');

// @route   GET api/admin/mail?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAllByAdmin);

module.exports = router;
