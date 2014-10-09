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
			 $scope.getTopTracks($scope.artist.id);
			 $scope.getSimilarArtists($scope.artist.id);
		};

		$scope.isArtistSelected = function() {
			return !!$scope.artist;
		};

		$scope.getTopTracks = function () {
			radioApi.artist.topTracks.get({ artistId: $scope.artist.id })
				.$promise
				.then(function (response) {
					$scope.topTracks = response.tracks.track.map(function (item) {
						return {
							id: item.id,
							title: item.title,
							artist: item.artist.name,
							album: item.release.title,
							releaseDate : item.release.releaseDate,
							year: new Date(item.release.releaseDate).getFullYear()
						}
					});
				});
		};

		$scope.getSimilarArtists = function () {
			radioApi.artist.similar.get({ artistId: $scope.artist.id })
				.$promise
				.then(function (response) {
					$scope.similarArtists = response.artists.artist.map(function (item) {
						return {
							id: item.id,
							name: item.name
						}
					});
				});
		};

	});
