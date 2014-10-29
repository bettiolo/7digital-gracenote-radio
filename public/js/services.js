angular.module('7gRadio.services', [])
  //.factory('socket', function (socketFactory) {
  //  return socketFactory();
  //})
  .factory('radioApi', function ($resource) {
    return {
      user: {
        create: $resource('/api/user/create')
      },
      artist: {
        search: $resource('/api/artist/search/:q'),
        topTracks: $resource('api/artist/:artistId/toptracks'),
        similar: $resource('api/artist/:artistId/similar'),
        chart: $resource('api/artist/chart')
      },
      moods: $resource('api/moods'),
      eras: $resource('api/eras'),
      genres: $resource('api/genres'),
      radio: {
        create: $resource('/api/radio/create'),
        recommend: $resource('/api/radio/recommend')
      },
      stream: $resource('/api/stream/:trackId')
    };
  });
