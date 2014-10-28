var frisby = require('frisby'),
    config = require('../config');

var baseUrl = 'http://localhost:' + config.port;
var gnUserId = config.checkAndLoadEnvironment('GRACENOTE_TEST_USER_ID');

frisby.create('should return ok from ~/status endpoint')
  .get(baseUrl + '/api/status')
  .expectStatus(200)
  .expectBodyContains('OK')
  .toss();

frisby.create('should return a seeded track list from ~/radio/create endpoint')
  .get(baseUrl + '/api/radio/create?seed=text_artist_Taylor+Swift&gnUserId=' + gnUserId)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    gracenoteRadioId: String,
    tracks: Array
  })
  .expectJSONTypes('tracks.?', {
    title: String,
    artist: String,
    album: String,
    gracenoteId: String,
    sevendigitalId: Number
  })
  .expectJSONLength('tracks', 25)
  .toss();

