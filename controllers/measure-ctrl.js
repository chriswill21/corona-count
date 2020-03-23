const Measure = require('../models/Measure');

test = (req, res) => {
    return res.send('measure route testing!')
};

getAllMeasures = (req, res) => {
    Measure.find({}, (err, measures) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        return res.status(200).json({success: true, measures: measures})
    });
};

getMeasure = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({success: false, error: 'Must provide a measure ID'})
    }

    Measure.findById(req.params.id, (err, measure) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure with that ID not found'})
        }
        return res.status(200).json({success: true, measure: measure})
    })
};

updateScore = (req, res) => {
    if (!req.params.measure_id || !req.params.user_id || !req.params.score_delta) {
        return res.status(400).json({success: false, error: 'Missing parameters'})
    }

    Measure.findById(req.params.measure_id, (err, measure) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure not found with that ID'})
        }
        let found_user = false;
        measure.ratings.forEach(rating => {
            if (rating.user === req.params.user_id) {
                found_user = true;
                rating.score += parseInt(req.params.score_delta);
            }
        });

        if (!found_user) {
            return res.status(404).json({success: false, error: 'User with that ID not in this measureq'})
        }
        measure
            .save()
            .then(() => {
                return res.status(200).json({success: true, message: 'Successfully updated user\' score'})
            })
            .catch(e => {
                return res.status(400).json({success: false, error: e})
            });
    });
};


module.exports = {
    test,
    getAllMeasures,
    getMeasure,
    updateScore
};