// Load Bunker model
const User = require('../models/User');
const Bunker = require('../models/Bunker');
const Measure = require('../models/Measure');

test = (req, res) => {
    return res.send('bunker route testing!');
};

getAllBunkers = (req, res) => {
    Bunker.find({}, function (err, bunkers) {
        if (err) {
            return res.status(400).json({success: false, error: err})
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
            req.body.users.forEach(user_id => {
                User.findOneAndUpdate({user_id: user_id}, {$push: {bunkers: bunker._id}}, (err, user) => {
                    if (err) {
                        return res.status(400).json({success: false, error: err})
                    }
                    if (!user) {
                        return res.status(404).json({success: false, error: 'User not found with that ID'})
                    }
                })
            });
            return res.status(201).json({success: true, bunker: bunker, message: 'Bunker added successfully'})
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

    Bunker.findOneAndUpdate(conditions, {$push: {users: req.params.user_id}})
        .exec((err, bunker) => {
            if (err) {
                return res.status(400).json({success: false, error: err})
            }
            if (!bunker) {
                return res.status(404).json({
                    success: false,
                    error: 'Bunker not found with that ID, or user already exists in this bunker'
                })
            }

            bunker.measures.forEach(measure_id => {
                Measure.findById(measure_id, (er, measure) => {
                    if (er) {
                        return res.status(400).json({success: false, error: er})
                    }
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
                    measure.save();
                })
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
                        return res.status(200).json({
                            success: true,
                            bunker: bunker,
                            message: 'Successfully added User to Bunker'
                        })
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

    Bunker.findOneAndUpdate(conditions, {$pull: {users: req.params.user_id}})
        .exec((err, bunker) => {
            if (err) {
                return res.status(400).json({success: false, error: err})
            }
            if (!bunker) {
                return res.status(404).json({success: false, error: 'Bunker or user not found with that ID'})
            }

            bunker.measures.forEach(measure_id => {
                Measure.findById(measure_id, (er, measure) => {
                    if (er) {
                        return res.status(400).json({success: false, error: er})
                    }
                    for (let i = 0; i < measure.ratings.length; i++) {
                        const rating = measure.ratings[i];
                        if (rating.user === req.params.user_id) {
                            measure.ratings.splice(i, i + 1);
                            break;
                        }
                    }
                    measure.save();
                })
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

    Bunker.findById(req.params.bunker_id)
        .populate('measures')
        .exec((err, bunker) => {
            if (err) {
                return res.status(404).json({success: false, error: err})
            }
            if (!bunker) {
                return res.status(404).json({
                    success: false,
                    error: 'Bunker with that ID not found'
                })
            }

            let failed = false;
            bunker.measures.forEach(measure => {
                if (measure.name === req.params.measure_name) {
                    failed = true;
                    return res.status(400).json({
                        success: false,
                        error: 'Measure with that name already exists in bunker'
                    })
                }
            });

            if (!failed) {
                const ratings = [];
                bunker.users.forEach(user_id => {
                    const rating = {user: user_id, score: req.params.default_score};
                    ratings.push(rating);
                });
                const measure_body = {name: req.params.measure_name, ratings: ratings, feed: []};
                const new_measure = new Measure(measure_body);
                new_measure
                    .save()
                    .then(() => {
                        Bunker.findByIdAndUpdate(req.params.bunker_id, {$push: {measures: new_measure._id}}, (err, bunker) => {
                            if (err) {
                                return res.status(400).json({success: false, error: err})
                            }
                            return res.status(200).json({
                                success: true,
                                measure: measure_body,
                                message: 'Measure added to bunker successfully'
                            })
                        });
                    })
            }
        });
};

deleteMeasureFromBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    if (!req.params.measure_id) {
        return res.status(400).json({success: false, error: 'Must provide a measure ID'})
    }

    Bunker.findByIdAndUpdate(req.params.bunker_id, {$pull: {measures: req.params.measure_id}}, (err, bunker) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker not found with that ID'})
        }
        Measure.findByIdAndDelete(req.params.measure_id, (e, measure) => {
            if (e) {
                return res.status(400).json({success: false, error: e})
            }
            if (!measure) {
                return res.status(404).json({success: false, error: 'Measure not found with that ID'})
            }
            return res.status(200).json({success: true, message: 'Successfully deleted measure from bunker'})
        });
    })
};

getMeasuresForBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide bunker ID'})
    }
    Bunker.findById(req.params.bunker_id, 'measures')
        .populate('measures')
        .exec((error, bunker) => {
            if (error) {
                return res.status(400).json({success: false, error: error})
            }
            if (!bunker) {
                return res.status(404).json({success: false, error: 'Bunker not found with that ID'})
            }
            return res.status(200).json({success: true, measures: bunker.measures})
        });
};


getUsersInBunker = (req, res) => {
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a bunker ID'})
    }
    Bunker.findById(req.params.bunker_id, 'users', (error, bunker) => {
        if (error) {
            return res.status(400).json({success: false, error: error})
        }
        if (!bunker) {
            return res.status(404).json({success: false, error: 'Bunker not found with that ID'})
        }
        const conditions = {
            user_id: {$in: bunker.users}
        };
        User.find(conditions, {_id: 0, name: 1, user_id: 1}, (err, users) => {
            if (err) {
                return res.status(400).json({success: false, error: err})
            }
            if (!users) {
                return res.status(404).json({success: false, error: 'User not found with that ID'})
            }
            return res.status(200).json({success: true, users: users})
        });

    })
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
    getMeasuresForBunker,
    getUsersInBunker
};