'use strict';

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
    ]

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

    $http.get('/details').success(function (data) {
        if (data && !data.error) {
            $scope.name = data.name;
        }
    });
};

function AdminCtrl($scope, $http, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
    $scope.votes = [];
    $scope.dtInstance = {};
    $scope.dtColumns = {};
    $scope.dtOptions = {};
    
    // Config DataTable
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(100)
        .withDOM('pitrfl')
        .withColumnFilter({
        aoColumns: [
            {
                type: 'text'
            }, {
                type: 'text',
                bRegex: true,
                bSmart: true
            }, {
                type: 'text',
                bRegex: true,
                bSmart: true
            },
            {
                type: "number"
            },
            {
                type: "number"
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
        DTColumnBuilder.newColumn('ID').withTitle('ID'),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6),
        DTColumnDefBuilder.newColumnDef(7)
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

    $scope.dtOptions = DTOptionsBuilder.newOptions()
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