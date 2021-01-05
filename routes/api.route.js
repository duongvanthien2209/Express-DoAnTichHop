const express = require('express');

const router = express.Router();

router.use('/admin', require('./admin.route'));

router.use('/user', require('./user.route'));

module.exports = router;
