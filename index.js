/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const cors = require('cors');
const { app, server } = require('./helpers/handleSocketIo.helper');

const connectDB = require('./config/db');

const { add, add1, add2, add3, add4, add5 } = require('./example');

// Kết nối database
connectDB();

// Listen for requests
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Static folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
const apiRoute = require('./routes/api.route');

app.use(cors());

app.use('/api', apiRoute);

// Thêm dữ liệu
// Loại nhà hàng
// add5('Bakery');
add1('Trà');

// Thêm dữ liệu
// add4();

// app.get('/', example);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
