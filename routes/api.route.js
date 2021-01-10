const express = require('express');

const router = express.Router();

const handleError = require('../helpers/handleError.helper');

router.use('/admin', require('./admin.route'));

router.use('/user', require('./user.route'));

router.use('/restaurantManager', require('./restaurantManager.route'));

router.use('/restaurantType', require('./restaurantType.route'));

router.use(handleError);

router.use('/restaurant', require('./restaurant.route'));

router.use(handleError);

module.exports = router;
