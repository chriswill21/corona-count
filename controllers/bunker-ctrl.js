// Load Bunker model
const Bunker = require('../models/Bunker');

test = (req, res) => {
    return res.send('bunker route testing!');
};

getAllBunkers = (req, res) => {
    Bunker.find({}, function(err, bunkers) {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: bunkers })
    })
};

getBunker = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, error: "Must provide Bunker ID" })
    }

    Bunker.findById(req.params.id, function(err, bunker) {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }
        if (!bunker) {
            return res.status(404).json({ success: false, error: 'No Bunker found with that ID' })
        }
        return res.status(200).json({ success: true, data: bunker })
    })
};

createBunker = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({ success: false, error: 'Must provide a bunker' })
    }

    const bunker = new Bunker(body);
    bunker
        .save()
        .then(() => {
            return res.status(201).json({ success: true, id: bunker._id, message: 'Bunker added successfully' })
        })
        .catch( error => {
            return res.status(400).json({ success: false, error: error, message: 'Bunker not added' })
        })
};

deleteBunker = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, error: 'Must provide a bunker id' })
    }

    Bunker.findOneAndDelete({_id: req.params.id}, (err, bunker) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!bunker) {
            return res.status(404).json({ success: false, error: 'Bunker not found with that ID' })
        }

        return res.status(200).json({ success: true, data: bunker })
    }).catch(error => {
        return res.status(400).json({ success: false, error: error })
    })
};

module.exports = {
    test,
    getAllBunkers,
    getBunker,
    createBunker,
    deleteBunker
};