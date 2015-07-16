
/*
 * GET home page.
 */

var SurveyController = require('../Controllers/SurveyController'),
    LoginController = require('../Controllers/LoginController'),
    AdminController = require('../Controllers/AdminController'),
    validator = require('validator'),
    utils = require('util');

exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

//TODO: We need to sync this with Active Directory
exports.login = function (req, res) {
    // validate params - check for injection attacks - winter is coming
    var errors = null; //todo: replace with validation shenanigans

    if (req.body && !errors) {
        LoginController.login(req, res);
    } else {
        res.status(403).json({ error: "No username or password was provided!" });
    }
};

exports.logout = function (req, res) {
    LoginController.logout(req, res);
}
        
exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
};

exports.survey = function (req, res) {
	if (!req.session.survey && !req.session.currentSurvey) {
		console.log("We encountered an error! - please re-scan!");
		res.render('droids', { title: 'Hackathon Survey', err: "Please re-scan to vote!" });
	} else {
		SurveyController.startSurvey(req, res);
	}
};

exports.submitSurvey = function (req, res) {
    if (!req.session.currentSurvey && !req.session.survey) { 
        //todo: need to handle error of not having an active survey
        res.render('droids', { title: 'Hackathon Survey', err: "Please re-scan to vote!" });
    } else {
        //todo: I think the currentSurvey -> survey is redudant - I think we may want to abandon this
        if (!req.session.currentSurvey && req.session.survey) {
            req.session.currentSurvey = req.session.survey;
            req.session.survey = null;
        }

        SurveyController.submitSurvey(req, res);
    }
};

exports.admin = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.tallyVotes = function (req, res) {
    AdminController.getVotes(req, res);
};

exports.tallyVotesAsExcel = function (req, res) {
    AdminController.getVotesAsExcel(req, res);
};