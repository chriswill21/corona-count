// Load Bunker model
const Bunker = require('../models/Bunker');

test = (req, res) => {
    return res.send('bunker route testing!');
};

getAllBunkers = (req, res) => {
    Bunker.find({}, function (err, bunkers) {
        if (err) {
            return res.status(404).json({success: false, error: err})
        }
        return res.status(200).json({success: true, bunkers: bunkers})
    })
};

getBunker = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({success: false, error: "Must provide Bunker ID"})
    }

    Bunker.findById(req.params.id, function (err, bunker) {
        if (err) {
            return res.status(404).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'No Bunker found with that ID'})
        }
        return res.status(200).json({success: true, bunker: bunker})
    })
};

createBunker = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({success: false, error: 'Must provide a bunker'})
    }

    const bunker = new Bunker(body);
    bunker
        .save()
        .then(() => {
            return res.status(201).json({success: true, id: bunker._id, message: 'Bunker added successfully'})
        })
        .catch(error => {
            return res.status(400).json({success: false, error: error, message: 'Bunker not added'})
        })
};

deleteBunker = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker id'})
    }

    Bunker.findByIdAndDelete(req.params.id, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }

        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker not found with that ID'})
        }

        return res.status(200).json({success: true, bunker: bunker})
    }).catch(error => {
        return res.status(400).json({success: false, error: error})
    })
};

addUserToBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    if (!req.params.user_id) {
        return res.status(400).json({success: false, error: 'Must provide a user ID'})
    }

    const conditions = {
        _id: req.params.bunker_id,
        users: {$nin: req.params.user_id}
    };

    Bunker.findOneAndUpdate(conditions, {$push: {users: req.params.user_id}}, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker not found with that ID, or user already exists in this bunker'})
        }

        bunker.measures.forEach(measure => {
            const ratings = measure.ratings;
            let default_score = 0;
            ratings.forEach(rating => {
                default_score += rating.score;
            });
            if (ratings.length) {
                Math.round(default_score /= ratings.length);
            }
            const rating = {user: req.params.user_id, score: default_score};
            measure.ratings.push(rating);
        });
        bunker
            .save()
            .then(() => {
                User.findOneAndUpdate({user_id: req.params.user_id}, {$push: {bunkers: req.params.bunker_id}}, (e, user) => {
                    if (e) {
                        return res.status(400).json({success: false, error: e})
                    }
                    if (!user) {
                        return res.status(400).json({success: false, error: 'User with that ID not found'})
                    }
                    return res.status(200).json({success: true, message: 'Successfully added User to Bunker'})
                })
            }).catch(error => {
                return res.status(400).json({success: false, error: error})
        });
    });
};

deleteUserFromBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    if (!req.params.user_id) {
        return res.status(400).json({success: false, error: 'Must provide a user ID'})
    }

    const conditions = {
        _id: req.params.bunker_id,
        users: {$in: req.params.user_id}
    };

    Bunker.findOneAndUpdate(conditions, {$pull: {users: req.params.user_id}}, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker or user not found with that ID'})
        }

        bunker.measures.forEach(measure => {
            for (let i = 0; i<measure.ratings.length; i++) {
                const rating = measure.ratings[i];
                if (rating.user === req.params.user_id) {
                    measure.ratings.splice(i, i+1);
                    break;
                }
            }
        });
        bunker
            .save()
            .then(() => {
                User.findOneAndUpdate({user_id: req.params.user_id}, {$pull: {bunkers: req.params.bunker_id}}, (e, user) => {
                    if (e) {
                        return res.status(400).json({success: false, error: e})
                    }
                    if (!user) {
                        return res.status(400).json({success: false, error: 'User with that ID not found'})
                    }
                    return res.status(200).json({success: true, message: 'Successfully deleted User from Bunker'})
                });
            }).catch(error => {
                return res.status(400).jston({success: false, error: error})
        });
    });
};

addMeasureToBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    if (!req.params.measure_name) {
        return res.status(400).json({success: false, error: 'Must provide a measure name'})
    }
    if (!req.params.default_score) {
        return res.status(400).json({success: false, error: 'Must provide a default score'})
    }

    const conditions = {
        _id: req.params.bunker_id,
        'measures.name': {$ne: req.params.measure_name}
    };

    Bunker.findOne(conditions, 'users', (err, users) => {
        if (err) {
            return res.status(404).json({success: false, error: err})
        }
        if (!users) {
            return res.status(404).json({success: false, error: 'Bunker with that ID not found, or measure name already exists in this bunker'})
        }
        const ratings = [];
        users.users.forEach(user_id => {
            const rating = {user: user_id, score: req.params.default_score};
            ratings.push(rating);
        });
        const measure_body = {name: req.params.measure_name, ratings: ratings};
        Bunker.findOneAndUpdate(conditions, {$push: {measures: measure_body}}, (err, bunker) => {
            if (err) {
                return res.status(400).json({success: false, error: err})
            }
            if (!bunker) {
            }
            return res.status(200).json({success: true, message: 'Measure added to bunker successfully'})
        });
    });
};

deleteMeasureFromBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    if (!req.params.measure_id) {
        return res.status(400).json({success: false, error: 'Must provide a measure ID'})
    }

    const conditions = {
        _id: req.params.bunker_id,
        'measures._id': {$eq: req.params.measure_id}
    };

    Bunker.findOneAndUpdate(conditions, {$pull: {measures: {_id: req.params.measure_id}}}, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker or measure not found with that ID'})
        }
        return res.status(200).json({success: true, message: 'Successfully deleted measure from bunker'})
    })
};

updateScore = (req, res) => {
    if (!req.params.bunker_id || !req.params.measure_id || !req.params.user_id || !req.params.score_delta) {
        return res.status(400).json({success: false, error: 'Missing parameters'})
    }

    Bunker.findById(req.params.bunker_id, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker not found with that ID'})
        }
        bunker.measures.forEach(measure => {
            if (measure._id.equals(req.params.measure_id)) {
                measure.ratings.forEach(rating => {
                    if (rating.user === req.params.user_id) {
                        rating.score += parseInt(req.params.score_delta);
                    }
                })
            }
        });
        bunker
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
    getAllBunkers,
    getBunker,
    createBunker,
    deleteBunker,
    addUserToBunker,
    deleteUserFromBunker,
    addMeasureToBunker,
    deleteMeasureFromBunker,
    updateScore
};