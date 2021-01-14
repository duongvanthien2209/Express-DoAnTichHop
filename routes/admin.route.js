const express = require('express');

const router = express.Router();

// HandleErrors
const handleError = require('../helpers/handleError.helper');
// Routes
const authRoute = require('./admin/auth.route');
const { protect } = require('../middlewares/admin/auth');

router.use('/auth', authRoute);

router.use(handleError);

router.use(protect);

router.use('/food', require('./admin/food.route'));

router.use(handleError);

router.use('/foodType', require('./admin/foodType.route'));

router.use(handleError);

module.exports = router;
