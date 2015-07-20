
////
// Yar Booty
var Mongoose = require('mongoose');
var connectString = 'mongodb://hvotedb.cloudapp.net';

////
// Private
// Config Mongoose
Mongoose.connect(connectString + '/hackVote');

Mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});

Mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});

////
// User Schema
var UserSchema = new Mongoose.Schema({
    alias: { type: String, required: true, unique: true },
    surveys: [{
            projectID: String,
            location: String,
            projectName: String,
            vote: Number
        }]
});

////
// User Model Methods
UserSchema.statics.exportData = function (cb) {
    this.find({}, function (err, users) {
        if (err || !users || users.length <= 0) {

        } else {
            var packet = [],
                le = users.length;

            while (le) {
                var user = users[le - 1];
                
                if (user && user.surveys && user.surveys.length && user.surveys.length > 0) {
                    var xx = user.surveys.length
                    
                    while (xx) {
                        if (user.surveys[xx - 1] && user.surveys[xx - 1].projectID) {
                            survey = user.surveys[xx - 1],
                            insert = {};

                            insert.alias = user.alias;
                            insert.projectID = survey.projectID;
                            insert.vote = survey.vote

                            packet.push(insert);
                        }
                        xx--;
                    } //while
                }
                le--;
            } // while

            cb(packet);
        }
    })
};

UserSchema.statics.tallyVotes = function (cb) {
    this.find({}, function (err, users) {
        if (err || !users || users.length <= 0) {
            if (!err)
                err = "No Users returned :: Users.tallyVotes()";

            console.error(err);
            cb(null);
        } else {
            var packet = {},
                le = users.length;
            
            while (le) {
                if (users[le - 1] && users[le - 1].surveys && users[le - 1].surveys.length >= 0) {
                    var len = users[le - 1].surveys.length;

                    while (len) {
                        var ref = users[le - 1].surveys[len - 1];
                        if (ref && ref.projectID) {
                            if (packet[ref.projectID]) {
                                if (packet[ref.projectID].vote && (packet[ref.projectID].vote[ref.vote] || packet[ref.projectID].vote[ref.vote] === 0)) {
                                    packet[ref.projectID].vote[ref.vote]++;
                                    packet[ref.projectID].total++;
                                } else {
                                    packet[ref.projectID].vote[ref.vote] = 1;
                                    packet[ref.projectID].total++;
                                }
                            } else {
                                packet[ref.projectID] = {
                                    vote: {},
                                    location: ref.location.toLowerCase(),
                                    projectName: ref.projectName,
                                    projectID: ref.projectID,
                                    total: 0
                                }
                                
                                var xx = 4;
                                while (xx) {
                                    packet[ref.projectID].vote[xx - 1] = 0;
                                    xx--;
                                }

                                packet[ref.projectID].vote[ref.vote] = 1;
                                packet[ref.projectID].total = 1;
                            }
                        }
                        len--;
                    } // while
                }
                
                le--;
            } // while
            
            // Create an Array of 
            var arr = [];
            Object.keys(packet).forEach(function (key) {
                arr.push(packet[key]);
            });

            cb(arr);
        }
    });
};

// User Instance Methods
UserSchema.methods.getProject = function (pID, cb) {
    var le = this.surveys.length;
    
    if (le <= 0)
        cb(null, null);
    else {
        while (le) {
            var surveys = this.surveys[le - 1];
            if (surveys && surveys.projectID === pID) {
                cb(null, le - 1);
                return;
            }
            le--;
        }
        cb(null, null);
    }
}


////
// Public
var User = Mongoose.model('User', UserSchema);
exports.User = User;