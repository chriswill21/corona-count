const mongoose = require('mongoose');

const MeasureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ratings: [{
        user: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    history: [{
        accuser_id: {
            type: String,
            required: true
        },
        victim_id: {
            type: String,
            required: true
        },
        delta: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        is_verified: {
            type: Boolean,
            required: true
        }
    }]
});

module.exports = Measure = mongoose.model('Measure', MeasureSchema);
