const mongoose = require('mongoose');

const BunkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: String,
        required: true
    }],
    measures: [{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Measure'
    }]
});

module.exports = Bunker = mongoose.model('Bunker', BunkerSchema);