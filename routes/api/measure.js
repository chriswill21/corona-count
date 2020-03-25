const express = require('express');
const router = express.Router();

// Load Measure control
const MeasureCtrl = require('../../controllers/measure-ctrl');

// @route GET api/measures/test
// @description Tests measure route
// @access Public
router.get('/test', MeasureCtrl.test);

// @route GET api/measures
// @description Gets all measures
// @access Public
router.get('/', MeasureCtrl.getAllMeasures);

// @route GET api/measures/:id
// @description Get single measure by id
// @access Public
router.get('/:id', MeasureCtrl.getMeasure);

// @route POST api/measures/feed/:measure_id
// @description Adds a new post to the beginning of a given measure's feed
// @access Public
router.post('/feed/:measure_id', MeasureCtrl.postToFeed);

// @route POST api/measures/verify/:measure_id/:post_id
// @description Updates a user's score for a measure
// @access Public
router.post('/verify/:measure_id/:post_id', MeasureCtrl.verifyPost);

module.exports = router;

