const express = require('express');

const router = express.Router();

// HandleErrors
const handleError = require('../helpers/handleError.helper');
// Routes
const authRoute = require('./admin/auth.route');

router.use('/auth', authRoute);

router.use(handleError);

module.exports = router;
