const express = require('express');

const router = express.Router();

const handleError = require('../helpers/handleError.helper');
const { protect } = require('../middlewares/restaurantManager/auth');

router.use('/auth', require('./restaurantManager/auth.route'));

router.use(handleError);

router.use(protect);

router.use(handleError);

router.use('/mail', require('./restaurantManager/mail.route'));

router.use(handleError);

router.use('/comment', require('./restaurantManager/comment.route'));

router.use(handleError);

router.use('/star', require('./restaurantManager/star.route'));

router.use(handleError);

router.use('/food', require('./restaurantManager/food.route'));

router.use(handleError);

router.use('/foodType', require('./restaurantManager/foodType.route'));

router.use(handleError);

router.use('/bill', require('./restaurantManager/bill.route'));

router.use(handleError);

module.exports = router;
