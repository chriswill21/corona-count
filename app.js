const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');

// routes
const users = require('./routes/api/user');
const bunkers = require('./routes/api/bunker');
const measures = require('./routes/api/measure');

// app and socket setup
const port = process.env.PORT || 8082;
const app = express();

app.listen(port, () => console.log(`Server running on port ${port}`));
const io = socketIO(app);
io.on('connection', function(socket){
    console.log("Socket connected...");
});
app.io = io;

// Connect Database
connectDB();

// use cors and parser
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// base page
app.get('/', (req, res) => res.send('Hello world!'));

// use routes
app.use('/api/users', users);
app.use('/api/bunkers', bunkers);
app.use('/api/measures', measures);

