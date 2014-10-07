angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, socket) {
		'use strict';
		var defaultSettings = {
			gracenoteClientId: 'Your Gracenote Client ID',
			sdConsumerKey: 'Your 7digital Consumer Key',
			sdConsumerSecret: 'Your 7digital Consumer Secret'
		};
		$scope.$storage = $localStorage.$default(defaultSettings);
		$scope.reset = function () {
			if ($window.confirm('Are you sure you want to reset your settings?')) {
				$scope.$storage.$reset(defaultSettings);
			}
		};
		$scope.test = function () {
			var rythmApi = new gracenote.RythmApi($scope.$storage.gracenoteClientId);
			rythmApi.register('marco.bettiolo@7digital.com');
		};
		socket.on('client:connected', function (data) {
			console.log('Client ID: ' + data.id);
		});
	});
