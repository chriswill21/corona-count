const express = require('express');
const router = express.Router();

// Load Bunker control
const BunkerCtrl = require('../../controllers/bunker-ctrl');

// @route GET api/bunkers/test
// @description Tests bunker route
// @access Public
router.get('/test', BunkerCtrl.test);

// @route GET api/bunkers
// @description Gets all bunkers
// @access Public
router.get('/', BunkerCtrl.getAllBunkers);

// @route GET api/bunkers/:id
// @description Get single bunker by id
// @access Public
router.get('/:id', BunkerCtrl.getBunker);

// @route POST api/bunkers
// @description Create a bunker
// @access Public
router.post('/', BunkerCtrl.createBunker);

// @route DELETE api/bunkers/:id
// @description Deletes a single bunker by id
// @access Public
router.delete('/:id', BunkerCtrl.deleteBunker);

module.exports = router;