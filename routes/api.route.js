const express = require('express');

const router = express.Router();

router.use('/admin', require('./admin.route'));

router.use('/user', require('./user.route'));

router.use('/restaurantManager', require('./restaurantManager.route'));

router.use('/restaurantType', require('./restaurantType.route'));

module.exports = router;
