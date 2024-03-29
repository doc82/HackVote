﻿'use strict';

function SuccessCtrl($scope, $http, $state) {

};

function SurveyCtrl($scope, $http, $state) {
    $scope.form = {vote: ''};
    $scope.error = [];
    $scope.name = '';

    $scope.questions = [
        {
            description: "Wow! This project…", answers: ['Inspired me!', 'Taught me something new!', 'It was really creative!']
        }
    ];

    $scope.init = function () {
        $http.get('/details').success(function (data) {
            if (data && !data.error) {
                $scope.name = data;
            }
        }).error(function (error) {
            $scope.error.push(error);
        });
    }

    $scope.submitForm = function () {
        $http.post('/survey', $scope.form).success(function (data) {
            if (data && data.error) {
                console.log(data);
            } else {
                $state.transitionTo('success');
            }
        })
        .error(function (data) {
            $scope.error = []
            $scope.error.push(data)
        });
    }

    $scope.init();
};

function AdminCtrl($scope, $http, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
    $('body').css('background-color','white');
    $scope.votes = [];
    $scope.dtInstance = {};
    $scope.dtColumns = {};
    $scope.dtOptions = {};

    // Config DataTable
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withBootstrap()
        .withPaginationType('full_numbers')
        .withDisplayLength(10)
        .withOption('responsive', true)
        //.withdom('pitrfl')
        .withColumnFilter({
            aoColumns: [
            //    {
            //        type: 'text',
            //        bRegex: true,
            //        bSmart: true
            //},
            {
                    type: 'text',
                    bRegex: true,
                    bSmart: true
                }, {
                    type: 'select',
                    bSmart: true,
                    values: [
                        'redmondsf', 'indiasf', 'chinasf', 'israelsf', 'lodonsf', 'svcsf'
                    ]
                },
                {
                    type: "number",
                    sWidth: '60px'
                },
                {
                    type: "number"
                },
                {
                    type: "number"
                },
                {
                    type: "number"
                }
            ]
    });

    $scope.dtColumns = [
        //DTColumnBuilder.newColumn('ID').withTitle('ID'),
        DTColumnBuilder.newColumn('Name').withTitle('Location'),
        DTColumnBuilder.newColumn('Location').withTitle('Name'),
        DTColumnBuilder.newColumn('Inspired').withTitle('Inspired'),
        DTColumnBuilder.newColumn('Taught').withTitle('Taught'),
        DTColumnBuilder.newColumn('Creative').withTitle('Creative').withOption('sWidth', '60px'),
        DTColumnBuilder.newColumn('Total').withTitle('Total')
    ];

    // This is Gross and may have a perf problem...
    $http.get('/votes').success(function (data) {
        if (data) {
            $scope.votes = data;
        }
    }).error(function (data) {
        if (data) {
            console.log(data);
        }
    });

    $scope.export = function () {
        location.href = "export";
    }
};

function LoginCtrl($scope, $http, $state) {
    $scope.form = {};
    $scope.error = [];

    $scope.submitForm = function () {
        if ($scope.form && $scope.form.user && $scope.form.password) {
            $http.post('/login', $scope.form).success(function (data) {
                if (data && data.error) {
                    $scope.error = [];
                    $scope.error.push(data.error);
                } else {
                    $state.transitionTo(data.url);
                }
            }).
            error(function (data) {
                $scope.error = [];
                $scope.error.push(data.error);
            });
        } else {
            $scope.error = []
            if (!$scope.form.user) {
                console.log("no user!");
                $scope.error.push("Please enter your MS-Corp Alias");
            }

            if (!$scope.form.password) {
                $scope.error.push("Please enter a password");
            }
        }
    }
};

function LoginSurveyCtrl($scope, $http, $state) {
    $scope.form = {};
    $scope.error = [];

    $scope.submitForm = function () {
        if ($scope.form && $scope.form.user && $scope.form.location) {
            $http.post('/login', $scope.form).success(function (data) {
                if (data && data.error) {
                    $scope.error = [];
                    $scope.error.push(data.error);
                } else {
                    $state.transitionTo(data.url);
                }
            }).
            error(function (data) {
                $scope.error = [];
                $scope.error.push(data.error);
            });
        } else {
            $scope.error = []
            if (!$scope.form.user) {
                console.log("no user!");
                $scope.error.push("Please enter your MS-Corp Alias");
            }

            if (!$scope.form.location) {
                $scope.error.push("Please select a location!");
            }
        }
    }
};
