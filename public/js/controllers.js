angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, socket, radioApi) {
		'use strict';
		socket.on('client:connected', function (data) {
			console.log('Socket.IO connected. Client ID: ' + data.id);
		});
		var defaultSettings = {
			email: 'Your Email',
			gracenoteUserId: ''
		};
		$scope.$storage = $localStorage.$default(defaultSettings);
		$scope.reset = function () {
			if ($window.confirm('Are you sure you want to reset your settings?')) {
				$scope.$storage.$reset(defaultSettings);
			}
		};
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
