const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

// routes
const users = require('./routes/api/user');
const bunkers = require('./routes/api/bunker');
const measures = require('./routes/api/measure');

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

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
