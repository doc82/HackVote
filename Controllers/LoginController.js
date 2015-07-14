
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
        // TODO: passport active directory needed here
        //crypto.randomBytes(48, function (ex, buf) {
        //    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
        //    req.session.token
        //})
        req.session.user = req.body.user;
        req.session.auth = 'survey';
        // OK User is authorized, now lets make sure we actually have a survey..
        if ((req.session.currentSurvey && req.session.currentSurvey) || (req.session.survey && req.session.survey.projectID)) {
            res.json({ url: 'survey' });
        } else {
            // send them back to the home screenr
            res.status(500);
            res.json({
                error: "Unable to find session data for this survey. Contact a hacker, or re-scan."
            });
        }
    }    
};

exports.logout = function (req, res) {
    req.session.destroy();
};