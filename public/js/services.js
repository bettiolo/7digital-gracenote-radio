angular.module('7gRadio.services', [])
	.factory('socket', function (socketFactory) {
		return socketFactory();
	});
