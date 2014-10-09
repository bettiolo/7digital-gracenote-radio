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
					if (!response.searchResults) {
						$scope.artists = [];
						return;
					}
					$scope.artists = response.searchResults.searchResult.map(function (searchResult) {
						return {
							id: searchResult.artist.id,
							name: searchResult.artist.name
						}
					});
				});
		};

		$scope.selectArtist = function(artist) {
			$scope.artist = artist;
			$scope.getSimilarArtists($scope.artist.id);
			// $scope.getTopTracks($scope.artist.id);
		};

		$scope.isArtistSelected = function() {
			return !!$scope.artist;
		};

		$scope.getSimilarArtists = function () {
			radioApi.artist.similar.get({ artistId: $scope.artist.id })
				.$promise
				.then(function (response) {
					$scope.similarArtists = response.artists.artist.map(function (artist) {
						return {
							id: artist.id,
							name: artist.name
						}
					});
				});
		};

//		$scope.getTopTracks = function () {
//			radioApi.artist.topTracks.get({ artistId: $scope.artist.id })
//				.$promise
//				.then(function (response) {
//					if(!response.tracks) {
//						$scope.topTracks = [];
//						return;
//					}
//					$scope.topTracks = response.tracks.track.map(function (track) {
//						return {
//							id: track.id,
//							title: track.title,
//							artist: track.artist.name,
//							album: track.release.title,
//							releaseDate : track.release.releaseDate,
//							year: new Date(track.release.releaseDate).getFullYear()
//						}
//					});
//				});
//		};

	});
