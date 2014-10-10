var app = angular.module('7gRadio', [
	'ngRoute',
	'ngResource',
	'ngStorage',

	'btford.socket-io',
	'mediaPlayer',

	'7gRadio.services',
	'7gRadio.controllers'
]);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'partials/main'
		})
		.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode(true);
});
