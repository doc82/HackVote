var express = require('express'),
    passport = require('passport'),
    AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy,
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    parseurl = require('parseurl'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    Mongoose = require('mongoose'),
    request = require('request'),
    json2xls = require('json2xls'),
    md5 = require('md5'),
    app = express();

// Config DB && Session 
var sessConfig = {
        saveUninitialized: false,
        resave: false,
        secret: 'i$Am3234D#$@dsaAdl5d2B2d!5sX',
        duration: 60 * 1000 * 60,
        activeDuration: 10 * 60 * 1000,
        store: new MongoStore({ mongooseConnection: Mongoose.connection }),
        cookie: {
            secure: false
        }
    };

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)       // trust first proxy
    //sessConfig.cookie.secure = true // serve secure cookies
}


// TOLD TO RIP THIS OUT - RIP SECURITY 7/22
/////////////////////////////

//// Configure Passport for authentication against AzureAD
//// we could store this stuff in db if we wanted/needed to
//passport.serializeUser(function(user,cb){
//    // TODO: save the user to a persistence layer (in-memory, redis cache, etc)
//    // cb([err], [userId])
//    cb(null, user);
//});

//passport.deserializeUser(function(userId,cb){
//    // TODO: load a user from the persistence layer
//    // cb([err], [user])
//    cb(null, userId);
//});

//passport.use(new AzureAdOAuth2Strategy({
//    clientID: '2ce2a7c8-95c6-4915-b7cc-785854203de7',
//    clientSecret: 'x8kgKfWTMOaq7FPfKn6A2BBbsaVLYvmiPajFmAFHXU0=',
//    callbackURL: 'http://votehack.azurewebsites.net/login/callback',
//    //callbackURL: 'http://localhost:1337/login/callback',
//    resource: '00000002-0000-0000-c000-000000000000',
//    tenant: 'microsoft.com'
//},
//function (accessToken, refresh_token, params, profile, done) {
//    request.get({uri: "https://graph.windows.net/me?api-version=1.5", headers: {
//        "Authorization": "Bearer "+params.access_token
//    }}, function (err, res, body) {
//        var parsed;
//        try {
//            parsed = JSON.parse(body);
//        } catch (e) {
//            // original err takes presidence, if not set and this throws, we set it
//            err = err || e;
//        }

//        if (typeof(parsed) === "undefined") {
//            // original err takes presidence, if not set and this if is true, we set it
//            err = err || new Error("userdata could not be read");
//        }
//        else if (!parsed.mail) {
//            // original err takes presidence, if not set and this if is true, we set it
//            err = err || new Error("user has no email");
//        }
//        done(err, (err) ? {} : {email: parsed.mail});
//    });
    
//}));

// Configure Express + Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session(sessConfig));
app.use(passport.initialize());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json())
app.use(express.urlencoded());
app.use(expressValidator()); 
app.use(express.methodOverride());
app.use(json2xls.middleware);
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Router + error middleware
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Speceial case to handle partials.. (stupid)
app.get('/partials/:name', function (req , res) {
    return res.render('partials/' + req.params.name);
});

// Handle Admin 
function isAdminAuth(req, res, next) {
    if (req.session.auth && req.session.auth === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};

function isSurveyAuth(req, res, next) {
    // Are we logged in already - go ahead and advance to the survey screen
    if (req.session.user && req.session.auth && req.session.auth === 'survey' && ((req.session.currentSurvey && req.session.currentSurvey.projectID) || (req.session.survey && req.session.survey.projectID))) {
        console.log("Succesfully going into survey mode!");
        next();
    } else {
        console.log("session fail" + req.session.user);
        console.log("We had an issue with displaying a survey!");
        return res.redirect('/droids');     
    }
};

function loginCheck(req, res, next) {
    function prepPacket(req) {
        return {
            projectID: md5(req.query.projectName),
            location: req.query.location.toLowerCase(),
            projectName: req.query.projectName.replace(/%/g, ' ')// sanitize any %'s
        };
    }
    // Entry point
    if (req.session.user && req.session.auth && req.session.auth === 'survey' && ((req.session.currentSurvey && req.session.currentSurvey.projectID) || (req.session.survey && req.session.survey.projectID))) {
        if (req.session.currentSurvey && req.session.currentSurvey.projectID && req.query.projectID) {
            req.session.currentSurvey = null;
            req.session.survey = prepPacket(req);
        } else if (req.session.survey && req.session.survey.projectID && req.query.projectID) {
            req.session.currentSurvey = null;
            req.session.survey = prepPacket(req);
        }

        return next();
    } else if (req.query.projectName ) {
        req.session.currentSurvey = null;
        req.session.survey = prepPacket(req);
        
        if (req.session.user && req.session.auth && req.session.auth === 'survey') {
            return res.redirect('/survey');
        } else {
            return next();
        }
    } else {
        req.session.currentSurvey = null;
        req.session.survey = null;
        console.log("error! -trying to log in but no query data provided! ");
        return res.redirect('/droids');
    }
}

////
// Routes
//removed active directory login...
//app.get('/login', loginCheck, passport.authenticate('azure_ad_oauth2'));
//app.get('/login/callback', passport.authenticate('azure_ad_oauth2', { failureRedirect: '/droids' }),
//function (req, res) {
//    req.session.auth = 'survey';
//    req.session.user = req.user.email;
//    console.log("Successfully authed!" + req.session.user);
//    return res.redirect('/survey');
//});

// our hacky login system
app.get('/login', loginCheck, routes.showSurveyLogin);

// Login and Admin
app.get('/', routes.index);
app.get('/adminportal', routes.index);
app.post('/login', routes.login);

// Survey
app.get('/survey', isSurveyAuth, routes.survey);
app.post('/survey', isSurveyAuth, routes.submitSurvey);
app.get('/details', isSurveyAuth, routes.details);
app.get('/success', routes.success);

// Admin
app.get('/votes', isAdminAuth, routes.tallyVotes);
app.get('/admin', isAdminAuth, routes.admin);
app.get('/export', isAdminAuth, routes.exportData);

////
// Error Handlers
// catch 404 and forward to error handler   
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('droids', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('droids', {
        message: err.message,
        error: {}
    });
});

////
// Light the fires and kick the tires big daddy
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});