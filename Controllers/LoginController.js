
////
// Yar Booty
var User = require('../models/Survey').User,
    crypto = require('crypto');
var admin = {
    name: 'GarageMaster',
    password: 'TheGTeam!'
}

////
// Private
// Find a user and return - otherwise create a new one
function findCreateUser(userData, cb) {
    User.findOne({ alias: userData }, function (err, user) {
        if (err) {
            console.error(err);
            cb({ error: err });
        } else if (user) {
            // Found the user - no need to save a new one
            cb(user);
        } else {
            // Create a new user
            var newUser = new User({
                alias: userData,
                survey : []
            });
            
            newUser.save(function (err, user) {
                if (err) {
                    console.error(err);
                    cb({ error: err });
                } else {
                    cb(user);
                }
            });
        }
    });
}

////
// Public
exports.auth = function (req, res) {

}

exports.login = function (req, res) {
    // Check admin login first -- total hack, but this is easy for me. and i'm all that matters
    if (req.body.user === admin.name && req.body.password === admin.password) {
        // Success - give access to admin
        req.session.auth = 'admin';
        res.json({ url: 'admin' });
    } else {
        findCreateUser(req.body.user, function (packet) {
            if (!packet || packet.error) {
                return res.json({
                    error: "Experienced an issue.. Contact an adminstrator.."
                });
            } else {
                req.session.auth = 'survey';
                req.session.user = req.body.user;
                console.log("Successfully authed!" + req.session.user);
                return res.json( { error: null, url: '/survey'})
            }
        });
    }    
};

exports.logout = function (req, res) {
    req.session.destroy();
};