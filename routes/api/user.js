const express = require('express');
const router = express.Router();

// Load User control
const UserCtrl = require('../../controllers/user-ctrl');

// @route GET api/users/test
// @description Tests user route
// @access Public
router.get('/test', UserCtrl.test);

// @route GET api/users
// @description Gets all users
// @access Public
router.get('/', UserCtrl.getAllUsers);

// @route GET api/users/:id
// @description Get single user by id
// @access Public
router.get('/:id', UserCtrl.getUser);

// @route POST api/users
// @description Create a user
// @access Public
router.post('/', UserCtrl.createUser);

// @route DELETE api/users/:id
// @description Deletes a single user by id
// @access Public
router.delete('/:id', UserCtrl.deleteUser);

// @route POST api/users/:id/:name
// @description Updates a user by id to name
// @access Public
router.post('/:id/:name', UserCtrl.updateUserName);

module.exports = router;