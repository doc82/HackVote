'use strict';

var HackVote = angular.module('HackVote', ['ui.router', 'datatables', 'datatables.columnfilter', 'datatables.bootstrap']);

HackVote.config(function ($stateProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode({ enabled: true, rewriteLinks: false });
    
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    ////disable IE ajax request caching
    //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    //// extra
    //$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    //$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    $stateProvider
    .state('home', {
        url: '/',
        views: {
            '' : {
                templateUrl: 'partials/partial-login',
                controller: LoginCtrl
            }
        }
    })
    .state('survey', {
        url: '/survey',
        views: {
            '' : {
                templateUrl: 'partials/partial-survey',
                controller: SurveyCtrl
            }
        }
    })
    .state('login', {
        url: '/login',
        views: {
            '' : {
                templateUrl: 'partials/partial-survey-login',
                controller: LoginSurveyCtrl
            }
        }
    })
    .state('admin', {
        url: '/admin',
        views: {
            '' : {
                templateUrl: 'partials/partial-admin',
                controller: AdminCtrl
            }
        }
    })
    .state('success', {
        url: '/success',
        views: {
            '' : {
                templateUrl: 'partials/partial-survey-success',
                controller: SuccessCtrl
            }
        }
    });
});