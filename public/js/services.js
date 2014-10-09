angular.module('7gRadio.services', [])
	.factory('socket', function (socketFactory) {
		return socketFactory();
	})
	.factory('radioApi', function($resource){
		return {
			createUser : $resource('/api/user/create/:email')
		};
	});
