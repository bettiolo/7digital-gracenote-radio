angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, socket, radioApi) {
		'use strict';
		socket.on('client:connected', function (data) {
			console.info('Socket.IO connected. Client ID: ' + data.id);
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

		$scope.$watch('isRegistered()', function () {
			$scope.loadTopArtists();
			$scope.loadMoods();
			$scope.loadEras();
			$scope.loadGenres();
		});

		$scope.loadTopArtists = function () {
			radioApi.artist.chart.get()
				.$promise
				.then(function (response) {
					$scope.topArtists = response.chart.chartItem.map(function (chartItem) {
						return {
							id: chartItem.artist.id,
							name: chartItem.artist.name,
							position: chartItem.position,
							change: chartItem.change
						}
					});
				});
		};

		$scope.loadMoods = function () {
			radioApi.moods.get()
				.$promise
				.then(function (response) {
					$scope.moods = response.RESPONSE[0].MOOD.map(function (mood) {
						return {
							id: mood.ID,
							value: mood.VALUE
						}
					});
				});
		};

		$scope.loadEras = function () {
			radioApi.eras.get()
				.$promise
				.then(function (response) {
					$scope.eras = response.RESPONSE[0].ERA.map(function (era) {
						return {
							id: era.ID,
							value: era.VALUE
						}
					});
				});
		};

		$scope.loadGenres = function () {
			radioApi.genres.get()
				.$promise
				.then(function (response) {
					console.log(response);
					$scope.genres = response.RESPONSE[0].GENRE.map(function (genre) {
						return {
							id: genre.ID,
							value: genre.VALUE
						}
					});
				});
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
			$scope.loadSimilarArtists($scope.artist.id);
			// $scope.loadTopTracks($scope.artist.id);
		};

		$scope.isArtistSelected = function() {
			return !!$scope.artist;
		};

		$scope.loadSimilarArtists = function () {
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

//		$scope.loadTopTracks = function () {
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
