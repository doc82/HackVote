
////
// Yar booty
var mongoose = require('../').Mongo;
User = require('../models/Survey').User;

////
// Private
// Find a user and return - otherwise create a new one
function findCreateUser(userData, cb) {
    User.findOne({ alias: userData }, function (err, user) {
        if (err) {
            console.error(err);
            cb(null);
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
                    cb(null);
                } else {
                    cb(user);
                }
            });
        }
    });
}

////
// Public
exports.submitSurvey = function (req, res) {
    // Find or create a user
    findCreateUser(req.session.user, function (user) {
        if (!user) {
            console.error(err);
            res.json({ err: "There was a problem finding your user account. Contact an admin." });
        } else {
            user.getProject(req.session.currentSurvey.projectID, function (err, result) {
                if (err) {  
                    console.error(err);
                    res.json({ err: "Experiencing database issues - contact an admin" });
                } else if (result || result === 0) {
                    // Replace the old vote
                    user.surveys[result].vote = req.body.vote;

                    user.save(function (err, user) {
                        if (err) {
                            console.error(err);
                            res.json({ err: "Experiencing database issues - contact an admin" });
                        } else {
                            req.session.lastSurvey = req.session.currentSurvey;
                            req.session.currentSurvey = null;
                            res.json({ success: true });
                        }
                    });
                } else {
                    // Create a new Survey count
                    user.surveys.push({
                        projectID: req.session.currentSurvey.projectID,
                        projectName: req.session.currentSurvey.projectName,
                        location: req.session.currentSurvey.location,
                        vote: req.body.vote
                    });

                    user.save(function (err, user) {
                        if (err) {
                            console.error(err);
                            res.json({ err: "Experiencing database issues - contact an admin" });
                        } else {
                            req.session.lastSurvey = req.session.currentSurvey;
                            req.session.currentSurvey = null;
                            res.json({ success: true });
                        }
                    });
                }
            });
        }
    });
};

exports.startSurvey = function (req, res) {
    if (req.session.survey) {
        req.session.currentSurvey = req.session.survey;
        req.session.survey = null; // I think we want to wipe this out
    }

    res.render('index', {
        title: 'Vote for ' + req.session.currentSurvey.projectName,
        location: req.session.currentSurvey.projectName,
        projectName: req.session.currentSurvey.projectName,
        projectDesc: req.session.currentSurvey.projectDesc
    });
};

exports.details = function (req, res) {
    findCreateUser(req.session.user, function (user) {
        if (!user) {
            console.error(err);
            res.json({ err: "There was a problem finding your user account. Contact an admin." });
        } else {
            user.getProject(req.session.currentSurvey.projectID, function (err, result) {
                if (err) {
                    console.error(err);
                    res.json({ err: "Experiencing database issues - contact an admin" });
                } else if (result || result === 0) {
                    var response = {};
                    response.name = user.surveys[result].projectName;

                    res.json(response);
                }
            });
        }
    });
};