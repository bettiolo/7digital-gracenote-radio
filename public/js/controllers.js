angular.module('7gRadio.controllers', [])
  .controller('mainController', function ($scope, $localStorage, $window, /*socket,*/ radioApi) {
    'use strict';
//		socket.on('client:connected', function (data) {
//			console.info('Socket.IO connected. Client ID: ' + data.id);
//		});

    var defaultSettings = {};
    $scope.$storage = $localStorage.$default(defaultSettings);
    $scope.reset = function () {
      if ($window.confirm('Are you sure you want to reset your settings?')) {
        $scope.$storage.$reset(defaultSettings);
      }
    };

    $scope.createUser = function () {
      radioApi.user.create.get()
        .$promise
        .then(function (response) {
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
              position: chartItem.position
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
      radioApi.artist.search.get({q: $scope.artistQuery})
        .$promise
        .then(function (response) {
          if (!response.searchResults) {
            $scope.searchArtists = [];
            return;
          }
          $scope.searchArtists = response.searchResults.searchResult.map(function (searchResult) {
            return {
              id: searchResult.artist.id,
              name: searchResult.artist.name
            }
          });
        });
    };

    $scope.selectArtist = function (artist) {
      $scope.artist = artist;
      $scope.loadSimilarArtists($scope.artist.id);
      // $scope.loadTopTracks($scope.artist.id);
      // $scope.loadRecommendation();
    };

    $scope.isArtistSelected = function () {
      return !!$scope.artist;
    };

    $scope.resetArtist = function () {
      $scope.artist = null;
      $scope.similarArtists = [];
    };

    $scope.loadSimilarArtists = function () {
      radioApi.artist.similar.get({artistId: $scope.artist.id})
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
      $scope.radio = null;
      radioApi.radio.create.get({
        gnUserId: $scope.$storage.gracenoteUserId,
        artistName: $scope.artist.name
      }).$promise
        .then(function (response) {
          $scope.radio = response;
        });
    };

    $scope.createRadioFromSeed = function () {
      $scope.radio = null;
      radioApi.radio.create.get({
        gnUserId: $scope.$storage.gracenoteUserId,
        seed: $scope.seed
      }).$promise
        .then(function (response) {
          $scope.radio = response;
        });
    };

    $scope.isRadioCreated = function () {
      return !!$scope.radio;
    };

    $scope.hasRadioTracks = function () {
      return !!$scope.radio && !!$scope.radio.tracks.length;
    };

//		$scope.loadRecommendation = function () {
//			radioApi.radio.recommend.get()
//				.$promise
//				.then(function (response) {
//					var tracks = response.RESPONSE[0].ALBUM.map(function (album) {
//						var artist = album.TRACK[0].ARTIST
//							? album.TRACK[0].ARTIST[0].VALUE
//							: album.ARTIST[0].VALUE;
//						var sdId = album.TRACK[0].XID
//							? album.TRACK[0].XID[0].DATASOURCE == 'sevendigitalid'
//							? album.TRACK[0].XID[0].VALUE
//							: null
//							: null;
//						return {
//							album: album.TITLE[0].VALUE,
//							artist: artist,
//							title:  album.TRACK[0].TITLE[0].VALUE,
//							id: sdId
//						}
//					});
//					var matchedTracks = tracks.filter(function (track) {
//						return !!track.id;
//					});
//					$scope.recommendation = {
//						tracks: matchedTracks,
//						gnTracksCount: tracks.length,
//						matchedTracksCount: matchedTracks.length
//					};
//				});
//		};

    $scope.stream = function (trackId) {
      radioApi.stream.get({trackId: trackId})
        .$promise
        .then(function (response) {
          var playlistIndex = $scope.getPlaylistIndexByTrackId(trackId);
          $scope.currentStream = {
            trackId: trackId,
            playlistIndex: playlistIndex,
            hqFormat: response.hqFormat,
            hqUrl: response.hqUrl,
            lqFormat: response.lqFormat,
            lqUrl: response.lqUrl
          };
          $scope.play();
          $scope.queueNext();
        });
    };

    $scope.getPlaylistIndexByTrackId = function (trackId) {
      for (var i = 0; i < $scope.radio.tracks.length; i++) {
        if ($scope.radio.tracks[i].sevendigitalId == trackId) {
          return i;
        }
      }
      return -1;
    };

    $scope.queueNext = function () {
      $scope.nextStream = null;
      if ($scope.currentStream.playlistIndex < $scope.radio.tracks.length - 1) {
        $scope.queue($scope.radio.tracks[$scope.currentStream.playlistIndex + 1].sevendigitalId);
      }
    };

    $scope.queue = function (trackId) {
      radioApi.stream.get({trackId: trackId})
        .$promise
        .then(function (response) {
          var playlistIndex = $scope.getPlaylistIndexByTrackId(trackId);
          $scope.nextStream = {
            trackId: trackId,
            playlistIndex: playlistIndex,
            hqFormat: response.hqFormat,
            hqUrl: response.hqUrl,
            lqFormat: response.lqFormat,
            lqUrl: response.lqUrl
          };
        });
    };

    $scope.isStreaming = function () {
      return !!$scope.currentStream;
    };

    // $scope.$watch('playlist', function () {
    $scope.play = function () {
      $scope.playlist = [{
        src: $scope.currentStream.hqUrl,
        type: 'audio/mp4'
      }];
      $scope.audio1.one('canplay', function () {
        $scope.audio1.play(0, true);
//				$scope.audio1.play(0, true); // does not autoplay
        $scope.audio1.one('play', function () {
          $scope.audio1.seek(0);
        });
        $scope.audio1.on('ended', function () {
          console.log('Track ended');
          $scope.playNext();
          //if ($scope.audio1.currentTrack === $scope.audio1.tracks) {
          //  $scope.audio1.play(0);
          //} else {
          //  $scope.audio1.play($scope.audio1.currentTrack + 1);
          //}
        });
      });
    };
    //});

    $scope.playNext = function () {
      console.log('Play next');
      console.log($scope.currentStream);
      $scope.currentStream = $scope.nextStream;
      $scope.play();
      $scope.queueNext();
    };

    $scope.seekPercentage = function ($event) {
      var percentage = ($event.offsetX / $event.target.offsetWidth);
      if (percentage <= 1) {
        return percentage;
      } else {
        return 0;
      }
    }

  });
