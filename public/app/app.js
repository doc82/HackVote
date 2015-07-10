'use strict';

var HackVote = angular.module('HackVote', ['ui.router', 'datatables', 'datatables.columnfilter']);

HackVote.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, rewriteLinks: false });

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
                templateUrl: 'partials/partial-survey-success'
            }
        }
    });
});