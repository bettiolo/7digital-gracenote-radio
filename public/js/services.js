angular.module('7gRadio.services', [])
	.factory('socket', function (socketFactory) {
		return socketFactory();
	})
	.factory('radioApi', function($resource){
		return {
			user : {
				create : $resource('/api/user/create/:email')
			},
			artist : {
				search: $resource('/api/artist/search/:q'),
				topTracks: $resource('api/artist/:artistId/toptracks'),
				similar: $resource('api/artist/:artistId/similar')
			}
		};
	});
