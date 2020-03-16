// app.js
const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Long live BBlack panther club'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
