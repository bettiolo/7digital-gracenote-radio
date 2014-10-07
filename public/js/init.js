var app = angular.module('7gRadio', [
	'ngRoute',
	'ngStorage',

	'btford.socket-io',

	'7gRadio.services',
	'7gRadio.controllers'
]);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'partials/main',
			controller  : 'mainController'
		})
		.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode(true);
});
