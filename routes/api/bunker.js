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

// @route POST api/bunkers/user/:bunker_id/:user_id
// @description Adds a user with user_id to the bunker with bunker_id
// @access Public
router.post('/user/:bunker_id/:user_id', BunkerCtrl.addUserToBunker);

// @route DELETE api/bunkers/user/:bunker_id/:user_id
// @description Deletes a user with user_id from the bunker with bunker_id
// @access Public
router.delete('/user/:bunker_id/:user_id', BunkerCtrl.deleteUserFromBunker);

// @route POST api/bunkers/measure/:bunker_id/:measure_name/:default_score
// @description Adds a measure with measure_name and default_score to the bunker with bunker_id
// @access Public
router.post('/measure/:bunker_id/:measure_name/:default_score', BunkerCtrl.addMeasureToBunker);

// @route DELETE api/bunkers/measure/:bunker_id/:measure_id
// @description Deletes a measure with measure_id from the bunker with bunker_id
// @access Public
router.delete('/measure/:bunker_id/:measure_id', BunkerCtrl.deleteMeasureFromBunker);

// @route GET api/bunkers/measures/:bunker_id
// @description Gets all measure objects associated with a given bunker
// @access Public
router.get('/measures/:bunker_id', BunkerCtrl.getMeasuresForBunker);

// @route GET api/bunkers/users/:bunker_id
// @description Gets all user names in a bunker
// @access Public
router.get('/users/:bunker_id', BunkerCtrl.getUsersInBunker);

module.exports = router;