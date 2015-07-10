
////
// Yar booty
var mongoose = require('../').Mongo;
Users = require('../models/Survey').User;

////
// Private

////
// Public 
exports.getVotes = function (req, res) {
    Users.tallyVotes(function (votes) {
        res.json(votes);
    });
};

exports.admin = function (req, res) {
    res.render('index', {
        title: 'Welcome Admiral! ' + req.session.currentSurvey.projectName
    });
};