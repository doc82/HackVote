
////
// Yar Booty
var User = require('../models/Survey'),
    AuthenticationContext = require('adal-node').AuthenticationContext,
    crypto = require('crypto');
var admin = {
    name: 'GarageMaster',
    password: 'TheGTeam!'
}

var clientId = 'yourClientIdHere';
var clientSecret = 'yourAADIssuedClientSecretHere'
var redirectUri = 'yourRedirectUriHere';
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'myTenant';
var authorityUrl = authorityHostUrl + '/' + tenant;
var redirectUri = 'http://localhost:3000/getAToken';
var resource = '00000002-0000-0000-c000-000000000000';
var templateAuthzUrl = 'https://login.windows.net/' + tenant + '/oauth2/authorize?response_type=code&client_id=' 
    + clientId + '&redirect_uri=' + redirectUri + '&state=<state>&resource=' + resource;

////
// Private
function createAuthorizationUrl(state) {
    var authorizationUrl = templateAuthzUrl.replace('<client_id>', clientId);
    authorizationUrl = authorizationUrl.replace('<redirect_uri>', redirectUri);
    authorizationUrl = authorizationUrl.replace('<state>', state);
    authorizationUrl = authorizationUrl.replace('<resource>', resource);
    return authorizationUrl;
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