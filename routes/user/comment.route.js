const express = require('express');

const router = express.Router();

const { create } = require('../../controllers/comment.controller');

// @route   POST api/user/comment/create
// @desc    Tạo comment
// @access  Private
router.post('/create/:foodId', create);

module.exports = router;
