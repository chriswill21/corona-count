const mongoose = require('mongoose');

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
    }]
});

module.exports = Bunker = mongoose.model('Bunker', BunkerSchema);