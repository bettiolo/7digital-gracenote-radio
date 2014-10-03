var app = angular.module('7gRadio', ['ngStorage']);

app.controller('radioController', function ($scope, $localStorage) {
	'use strict';
	var defaultSettings = {
		gracenoteClientId: 'Your Gracenote Client ID',
		sdConsumerKey: 'Your 7digital Consumer Key',
		sdConsumerSecret: 'Your 7digital Consumer Secret'
	};
	$scope.$storage = $localStorage.$default(defaultSettings);
	$scope.reset = function () {
		$scope.$storage.$reset(defaultSettings);
	};
});

// https://c{{clientId}}.web.cddbp.net/webapi/