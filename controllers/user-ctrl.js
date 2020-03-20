// Load User model
const User = require('../models/User');
const Bunker = require('../models/Bunker');

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
        const conditions = {
            _id: {$in: user.bunkers}
        };

        Bunker.find(conditions, (e, bunkers) => {
            if (e) {
                return res.status(400).json({success: false, error: e})
            }
            if (!bunkers) {
                return res.status(404).json({success: false, error: 'No bunkers found with those IDs'})
            }
            return res.status(200).json({ success: true, user: user, bunkers: bunkers})
        });
    })
};

createUser = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({ success: false, error: 'Must provide a user' })
    }

    User.findOne({user_id: body.user_id}, (err, user) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }
        if (user) {
            return res.status(400).json({success: false, error: 'User with that ID already exists!'})
        }
        const new_user = new User(body);
        new_user
            .save()
            .then(() => {
                return res.status(201).json({ success: true, id: new_user.user_id, message: 'User added successfully' })
            })
            .catch( error => {
                return res.status(400).json({ success: false, error: error, message: 'User not added' })
            })
    });
};

// TODO: delete user from all bunkers and bunker measures they are in
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

isUserInBunker = (req, res) => {
    if (!req.params.user_id) {
        return res.status(400).json({success: false, error: 'Must provide a User ID'})
    }
    if (!req.params.bunker_id) {
        return res.status(400).json({success: false, error: 'Must provide a Bunker ID'})
    }

    User.findOne({user_id: req.params.user_id}, (error, user) => {
        if (error) {
            return res.status(400).json({success: false, error: error})
        }
        if (!user) {
            return res.status(404).json({success: false, error: 'No User found with that user ID'})
        }
        const result = user.bunkers.includes(req.params.bunker_id);
        return res.status(200).json({success: true, userInBunker: result})
    })
};

module.exports = {
    test,
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUserName,
    isUserInBunker
};