
////
// Yar booty
var mongoose = require('../').Mongo;
var json2xls = require('json2xls');

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

exports.exportData = function (req, res) {
    Users.exportData(function (data) {
         res.xls('export.xlsx', data);
    });
};