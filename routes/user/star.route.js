const express = require('express');

const router = express.Router();

const { create } = require('../../controllers/star.controller');

// @route   GET api/user/star/create
// @desc    Tạo mới star
// @access  Private
router.post('/create/:foodId', create);

module.exports = router;
