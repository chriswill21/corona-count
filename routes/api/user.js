// TODO: create three resources users, bunkers, rankings

const express = require('express');
const router = express.Router();

// Load User model
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
// @description add/save user
// @access Public
router.post('/', UserCtrl.createUser);

// @route DELETE api/users/:id
// @description Deletes a single user by id
// @access Public
router.delete('/:id', UserCtrl.deleteUser);

module.exports = router;