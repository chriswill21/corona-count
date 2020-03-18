const mongoose = require('mongoose');
const Bunker = require('./Bunker');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bunkers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Bunker',
        required: true
    }],
    user_id: {
        type: String,
        required: true
    }
});

module.exports = User = mongoose.model('User', UserSchema);