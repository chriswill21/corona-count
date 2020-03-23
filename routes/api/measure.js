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

// @route POST api/measures/:measure_id/:user_id/:score_delta
// @description Updates a user's score for a measure
// @access Public
router.post('/:measure_id/:user_id/:score_delta', MeasureCtrl.updateScore);

module.exports = router;

