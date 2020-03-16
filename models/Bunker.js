const mongoose = require('mongoose');
const User = require('./User');
const Measure = require('./Measure');

const BunkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }],
    measures: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Measure',
        required: true
    }]
});

module.exports = Bunker = mongoose.model('Bunker', BunkerSchema);