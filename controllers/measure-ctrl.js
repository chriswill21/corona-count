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
    if (!req.params.measure_id) {
        return res.status(400).json({success: false, error: 'Must provide a measure ID'})
    }

    Measure.findById(req.params.measure_id, (err, measure) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure with that ID not found'})
        }
        return res.status(200).json({success: true, measure: measure})
    })
};

postToFeed = (req, res) => {
    const feed_body = req.body;

    if (!req.params.measure_id) {
        return res.status(400).json({success: false, error: 'Must provide a Measure ID'})
    }
    if (!feed_body) {
        return res.status(400).json({success: false, error: 'Must provide a post body'})
    }
    if (feed_body.accuser_id === undefined ||
        feed_body.victim_id === undefined ||
        feed_body.delta === undefined ||
        feed_body.comment === undefined) {
        return res.status(400).json({success: false, error: 'Must provide all necessary body fields'})
    }

    Measure.findById(req.params.measure_id, (error, measure) => {
        if (error) {
            return res.status(400).json({success: false, error: error})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure with that ID not found'})
        }
        const new_post = {
            accuser_id: feed_body.accuser_id,
            victim_id: feed_body.victim_id,
            delta: feed_body.delta,
            comment: feed_body.comment,
            is_verified: false
        };
        measure.feed.unshift(new_post);
        measure
            .save()
            .then(() => {
                req.app.io.emit('new_post', measure.feed);
                return res.status(201).json({success: true, new_post: new_post, message: 'Successfully added new post'})
            })
            .catch(err => {
                return res.status(400).json({success: false, error: err})
            });
    });
};

verifyPost = (req, res) => {
    if (!req.params.measure_id || !req.params.post_id) {
        return res.status(400).json({success: false, error: 'Must provide measure ID and post ID'})
    }

    Measure.findById(req.params.measure_id, (err, measure) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure not found with that ID'})
        }
        let victim = null;
        let delta = null;
        let failed = false;
        measure.feed.forEach(post => {
            if (post._id.equals(req.params.post_id)) {
                if (post.is_verified) {
                    failed = true;
                    return res.status(400).json({success: false, error: 'Post has already been verified'})
                }
                victim = post.victim_id;
                delta = post.delta;
                post.is_verified = true;
            }
        });
        if (!failed) {
            if (!victim) {
                return res.status(404).json({success: false, error: 'Post with that ID not found'})
            }

            let found_user = false;
            measure.ratings.forEach(rating => {
                console.log(rating.user);
                if (rating.user === victim) {
                    found_user = true;
                    rating.score += delta;
                }
            });
            if (!found_user) {
                return res.status(404).json({success: false, error: 'User with that ID not in this measure'})
            }

            measure
                .save()
                .then(() => {
                    req.app.io.emit('verified_post', measure);
                    return res.status(200).json({success: true, message: 'Successfully updated user\'s score'})
                })
                .catch(e => {
                    return res.status(400).json({success: false, error: e})
                });
        }
    });
};

getFeed = (req, res) => {
    if (!req.params.measure_id) {
        return res.status(400).json({success: false, error: "Must provide a measure ID"})
    }

    Measure.findById(req.params.measure_id, (err, measure) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!measure) {
            return res.status(404).json({success: false, error: 'Measure with that ID not found'})
        }
        return res.status(200).json({success: true, feed: measure.feed})
    })
}

module.exports = {
    test,
    getAllMeasures,
    getMeasure,
    postToFeed,
    verifyPost,
    getFeed
};