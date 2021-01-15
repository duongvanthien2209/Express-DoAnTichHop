/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http');

const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');

const { add, add1, add2, add3 } = require('./example');

// Kết nối database
connectDB();

// Listen for requests
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Static folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
const apiRoute = require('./routes/api.route');

const { handleSocketIo } = require('./helpers/handleSocketIo.helper');
const { example } = require('./controllers/example.controller');

app.use(cors());

handleSocketIo(server);

app.use('/api', apiRoute);

app.get('/', example);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
