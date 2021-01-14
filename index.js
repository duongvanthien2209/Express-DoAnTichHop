/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http');

// const io = require('socket.io')(http);
// const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');

const { add, add1, add2, add3 } = require('./example');

// Kết nối database
connectDB();

// const app = express();
// Listen for requests
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(fileUpload());

// Static folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
const apiRoute = require('./routes/api.route');

const handleSocketIo = require('./helpers/handleSocketIo.helper');

app.use(cors());

handleSocketIo(server);

app.use('/api', apiRoute);

app.get('/', (req, res) => res.send('All done'));

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
