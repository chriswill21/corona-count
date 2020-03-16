const mongoose = require('mongoose');
const User = require('./User');

const MeasureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }]
});

module.exports = Measure = mongoose.model('Measure', MeasureSchema);