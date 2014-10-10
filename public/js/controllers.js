angular.module('7gRadio.controllers', [])
	.controller('mainController', function ($scope, $localStorage, $window, /*socket,*/ radioApi) {
		'use strict';
//		socket.on('client:connected', function (data) {
//			console.info('Socket.IO connected. Client ID: ' + data.id);
//		});

		var defaultSettings = {
		};
		$scope.$storage = $localStorage.$default(defaultSettings);
		$scope.reset = function () {
			if ($window.confirm('Are you sure you want to reset your settings?')) {
				$scope.$storage.$reset(defaultSettings);
			}
		};

		$scope.createUser = function () {
			radioApi.user.create.get()
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
			// $scope.loadMoods();
			// $scope.loadEras();
			// $scope.loadGenres();
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

//		$scope.loadMoods = function () {
//			radioApi.moods.query({gnUserId: $scope.$storage.gracenoteUserId}).get()
//				.$promise
//				.then(function (response) {
//					$scope.moods = response.RESPONSE[0].MOOD.map(function (mood) {
//						return {
//							id: mood.ID,
//							value: mood.VALUE
//						}
//					});
//				});
//		};
//
//		$scope.loadEras = function () {
//			radioApi.eras.get()
//				.$promise
//				.then(function (response) {
//					$scope.eras = response.RESPONSE[0].ERA.map(function (era) {
//						return {
//							id: era.ID,
//							value: era.VALUE
//						}
//					});
//				});
//		};
//
//		$scope.loadGenres = function () {
//			radioApi.genres.get()
//				.$promise
//				.then(function (response) {
//					$scope.genres = response.RESPONSE[0].GENRE.map(function (genre) {
//						return {
//							id: genre.ID,
//							value: genre.VALUE
//						}
//					});
//				});
//		};

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
			$scope.loadRecommendation();
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

		$scope.createRadio = function () {
			radioApi.radio.create.get()
				.$promise
				.then(function (response) {
					var tracks = response.RESPONSE[0].ALBUM.map(function (album) {
						var artist = album.TRACK[0].ARTIST
							? album.TRACK[0].ARTIST[0].VALUE
							: album.ARTIST[0].VALUE;
						var sdId = album.TRACK[0].XID
							? album.TRACK[0].XID[0].DATASOURCE == 'sevendigitalid'
							? album.TRACK[0].XID[0].VALUE
							: null
							: null;
						return {
							album: album.TITLE[0].VALUE,
							artist: artist,
							title:  album.TRACK[0].TITLE[0].VALUE,
							id: sdId
						}
					});
					var matchedTracks = tracks.filter(function (track) {
						return !!track.id;
					});
					$scope.radio = {
						id: response.RESPONSE[0].RADIO[0].ID,
						tracks: matchedTracks,
						gnTracksCount: tracks.length,
						matchedTracksCount: matchedTracks.length
					};
				});
		};

		$scope.isRadioCreated = function () {
			return !!$scope.radio;
		};

		$scope.loadRecommendation = function () {
			radioApi.radio.recommend.get()
				.$promise
				.then(function (response) {
					var tracks = response.RESPONSE[0].ALBUM.map(function (album) {
						var artist = album.TRACK[0].ARTIST
							? album.TRACK[0].ARTIST[0].VALUE
							: album.ARTIST[0].VALUE;
						var sdId = album.TRACK[0].XID
							? album.TRACK[0].XID[0].DATASOURCE == 'sevendigitalid'
							? album.TRACK[0].XID[0].VALUE
							: null
							: null;
						return {
							album: album.TITLE[0].VALUE,
							artist: artist,
							title:  album.TRACK[0].TITLE[0].VALUE,
							id: sdId
						}
					});
					var matchedTracks = tracks.filter(function (track) {
						return !!track.id;
					});
					$scope.recommendation = {
						tracks: matchedTracks,
						gnTracksCount: tracks.length,
						matchedTracksCount: matchedTracks.length
					};
				});
		};

		$scope.stream = function(trackId) {
			radioApi.stream.get({ trackId: trackId})
				.$promise
				.then(function (response) {
					$scope.streaming = {
						hqFormat: response.hqFormat,
						hqUrl: response.hqUrl,
						lqFormat: response.lqFormat,
						lqUrl: response.lqUrl
					};
					$scope.playlist = [ {
						src: $scope.streaming.hqUrl,
						type: 'audio/mp4'
					}];

				});
		};

		$scope.isStreaming = function() {
			return !!$scope.streaming;
		};

		$scope.$watch('playlist', function () {
			console.log('Playlist changed');
			$scope.audio1.one('canplay', function(){
				$scope.audio1.play(0);
//				$scope.audio1.play(0, true); // does not autoplay
//				$scope.audio1.one('play', function(){
//					$scope.audio1.seek(0);
//				});
//				$scope.audio1.on('ended', function(){
//					if ($scope.audio1.currentTrack === $scope.audio1.tracks) {
//						$scope.audio1.play(0);
//					} else {
//						$scope.audio1.play($scope.audio1.currentTrack + 1);
//					}
//				});
			});
		});

		$scope.seekPercentage = function ($event) {
			var percentage = ($event.offsetX / $event.target.offsetWidth);
			if (percentage <= 1) {
				return percentage;
			} else {
				return 0;
			}
		}

	});
