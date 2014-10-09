angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, socket, radioApi) {
		'use strict';
		socket.on('client:connected', function (data) {
			console.log('Socket.IO connected. Client ID: ' + data.id);
		});

		var defaultSettings = {
			email: 'Your Email'
		};
		$scope.$storage = $localStorage.$default(defaultSettings);

		$scope.reset = function () {
			if ($window.confirm('Are you sure you want to reset your settings?')) {
				$scope.$storage.$reset(defaultSettings);
			}
		};

		$scope.createUser = function () {
			radioApi.user.create.get({ email : $scope.$storage.email })
				.$promise
				.then(function(response) {
					$scope.$storage.gracenoteUserId = response.RESPONSE[0].USER[0].VALUE;
				});
		};

		$scope.isRegistered = function () {
			return !!$scope.$storage.gracenoteUserId;
		};

		$scope.searchArtist = function () {
			radioApi.artist.search.get({ q : $scope.artistQuery })
				.$promise
				.then(function(response) {
					if (response.searchResults) {
						$scope.artists = response.searchResults.searchResult.map(function (item) {
							return {
								id: item.artist.id,
								name: item.artist.name
							}
						});
					} else {
						$scope.artists = [];
					}
				});
		};

		$scope.selectArtist = function(artistId) {
			$scope.artist = $scope.artists.filter(function (item) {
				return item.id == artistId;
			})[0];
		};

		$scope.isArtistSelected = function() {
			return !!$scope.artist;
		};

		
	});
