// Load User model
const User = require('../models/User');

test = (req, res) => {
    return res.send('user route testing!');
};

getAllUsers = (req, res) => {
    User.find({}, function(err, users) {
        if (err) {
            return res.status(404).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, data: users })
    })
};

getUser = (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }
        if (!user) {
            return res.status(404).json({success: false, error: 'No User found with that ID'})
        }
        return res.status(200).json({ success: true, data: user})
    })
};

createUser = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Must provide a user',
        })
    }

    const user = new User(body);
    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User added successfully'
            })
        })
        .catch( error => {
            return res.status(400).json({
                success: false,
                error: error,
                message: 'User not added'
            })
        })

};

deleteUser = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            error: 'Must provide a user id',
        })
    }

    User.findOneAndDelete({_id: req.params.id}, (err, user) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }

        if (!user) {
            return res.status(404).json({success: false, error: 'User not found with that ID'})
        }

        return res.status(200).json({success: true, data: user})
    }).catch(error => {
        return res.status(400).json({success: false, error: error})
    })
};

module.exports = {
    test,
    getAllUsers,
    getUser,
    createUser,
    deleteUser
};