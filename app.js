const express = require('express');
const connectDB = require('./config/db');

const app = express();

// routes
const users = require('./routes/api/user');

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('Hello world!'));

// use routes
app.use('/api/users', users);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
