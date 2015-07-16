
////
// Yar booty
var excelExport = require('excel-export');
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

exports.getVotesAsExcel = function (req, res) {
    Users.tallyVotes(function (votes) {
        var conf = {};
        conf.cols = [{
            caption:'Project ID',
            type:'string'
        },{
            caption:'Total',
             type:'number'              
        }];
        conf.rows = votes;
        var result = excelExport.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Hackathon-Votes.xlsx");
        res.end(result, 'binary');
    });
}

exports.admin = function (req, res) {
    res.render('index', {
        title: 'Welcome Admiral! ' + req.session.currentSurvey.projectName
    });
};