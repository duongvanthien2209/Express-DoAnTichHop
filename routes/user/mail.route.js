const express = require('express');

const router = express.Router();

const { getAllByUser } = require('../../controllers/mail.controller');

// @route   GET api/user/mail?q=1
// @desc    Lấy danh sách món ăn
// @access  Private
router.get('/', getAllByUser);

module.exports = router;
