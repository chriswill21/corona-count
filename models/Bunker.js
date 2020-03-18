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
        }]
    }]
});

module.exports = Bunker = mongoose.model('Bunker', BunkerSchema);