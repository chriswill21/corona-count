// TODO: create three resources users, bunkers, rankings

const express = require('express');
const router = express.Router();

// Load User model
const User = require('../../models/User');

// @route GET api/users/test
// @description Tests user route
// @access Public
router.get('/test', (req, res) => res.send('user route testing!'));

module.exports = router;