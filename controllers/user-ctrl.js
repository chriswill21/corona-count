// Load User model
const User = require('../models/User');

test = (req, res) => {
    return res.send('user route testing!');
};

getAllUsers = (req, res) => {
    User.find({}, function(err, users) {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, users: users })
    })
};

getUser = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, error: "Must provide User ID" })
    }

    User.findOne({user_id: req.params.id}, function(err, user) {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }
        if (!user) {
            return res.status(404).json({success: false, error: 'No User found with that ID'})
        }
        return res.status(200).json({ success: true, user: user})
    })
};

createUser = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({ success: false, error: 'Must provide a user' })
    }

    const user = new User(body);
    user
        .save()
        .then(() => {
            return res.status(201).json({ success: true, id: user.user_id, message: 'User added successfully' })
        })
        .catch( error => {
            return res.status(400).json({ success: false, error: error, message: 'User not added' })
        })
};

deleteUser = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({success: false, error: 'Must provide a user id'})
    }

    User.findOneAndDelete({user_id: req.params.id}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found with that ID' })
        }

        return res.status(200).json({ success: true, user: user })
    }).catch(error => {
        return res.status(400).json({ success: false, error: error })
    })
};

updateUserName = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({success: false, error: 'Must provide a user id'})
    }
    if (!req.params.name) {
        return res.status(400).json({success: false, error: 'Must provide a new user name'})
    }

    User.findOneAndUpdate({user_id: req.params.id}, {name: req.params.name}, (err, user) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (!user) {
            return res.status(404).json({success: false, error: 'User not found with that ID'})
        }
        return res.status(200).json({success: true, old_user: user})
    }).catch(error => {
        return res.status(400).json({success: false, error: error})
    })
};

module.exports = {
    test,
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUserName
};