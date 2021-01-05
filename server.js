require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');

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

// Listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
