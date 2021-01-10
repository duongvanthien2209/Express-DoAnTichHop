/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');

const { add, add1 } = require('./example');

const app = express();

// Kết nối database
connectDB();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileUpload());

// Static folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
const apiRoute = require('./routes/api.route');

app.use(cors());

app.use('/api', apiRoute);

// add(
//   'Bún Bò Hiến Hằng',
//   'bunBoHienHang',
//   'duongvanthien1@gmail.com',
//   '12345678',
//   '0968971926',
//   '5ff48be1b17b99c8e9d08625',
//   '172 Núi Thành, Quận Hải Châu, Đà Nẵng',
// );

// add(
//   'Bánh Canh Khoa',
//   'banhCanhKhoa',
//   'duongvanthien2@gmail.com',
//   '12345678',
//   '0968971926',
//   '5ff48be1b17b99c8e9d08625',
//   '53 Lê Hữu Trác, Quận Sơn Trà, Đà Nẵng',
// );

// add1('Bún');
// add1('Bánh canh');

// Listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
