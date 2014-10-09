angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, socket, radioApi) {
		'use strict';
		var defaultSettings = {
			email: 'Your Email',
			gracenoteUserId: ''
		};
		$scope.$storage = $localStorage.$default(defaultSettings);
		console.log($scope.$storage);
		$scope.reset = function () {
			if ($window.confirm('Are you sure you want to reset your settings?')) {
				$scope.$storage.$reset(defaultSettings);
			}
		};
		socket.on('client:connected', function (data) {
			console.log('Client ID: ' + data.id);
		});

		$scope.createUser = function () {
			radioApi.createUser.get({ email : $scope.$storage.email })
				.$promise
				.then(function(response) {
					$scope.$storage.gracenoteUserId = response.RESPONSE[0].USER[0].VALUE;
				});
		};
		$scope.isRegistered = function () {
			return !!$scope.$storage.gracenoteUserId;
		};
	});
