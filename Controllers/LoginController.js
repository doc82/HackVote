
////
// Yar Booty
var User = require('../models/Survey'),
    crypto = require('crypto');
var admin = {
    name: 'GarageMaster',
    password: 'TheGTeam!'
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
        // send them back to the home screenr
        res.status(500);
        res.json({
            error: "Unable to find session data for this survey. Contact a hacker, or re-scan."
        });  
    }    
};

exports.logout = function (req, res) {
    req.session.destroy();
};