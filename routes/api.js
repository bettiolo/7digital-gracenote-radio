var debug = require('debug')('app');
var express = require('express');
var router = express.Router();
var config = require('../config');
var gracenote = require('../src/gracenote');
var api = require('7digital-api').configure({
  consumerkey: config.sevendigitalConsumerKey,
  consumersecret: config.sevendigitalConsumerSecret,
  defaultParams: {
    country: 'us'
  }
});
var artists = new api.Artists();
var rythmApi = new gracenote.RythmApi(config.gracenoteClientId);

router.get('/artist/search/:q', function (req, res) {
  artists.search({q: req.params.q}, function (err, data) {
    res.json(data);
  });
});

router.get('/artist/:artistId/toptracks', function (req, res) {
  artists.getTopTracks({artistid: req.params.artistId}, function (err, data) {
    res.json(data);
  });
});

router.get('/artist/:artistId/similar', function (req, res) {
  artists.getSimilar({artistid: req.params.artistId}, function (err, data) {
    res.json(data);
  });
});

router.get('/artist/chart', function (req, res) {
  artists.getChart(function (err, data) {
    res.json(data);
  });
});

//router.get('/album/recommend/:artistid', function (req, res) {
//	releases.getRecommendations({ artistid: req.params.artistid }, function(err, data) {
//		res.json(data);
//	});
//});

var https = require('https');

router.get('/moods', function (req, res) {
  requestFieldValue(req, res, 'RADIOMOOD');
});

router.get('/eras', function (req, res) {
  requestFieldValue(req, res, 'RADIOERA');
});

router.get('/genres', function (req, res) {
  requestFieldValue(req, res, 'RADIOGENRE');
});

router.get('/user/create', function (req, res) {
  request(rythmApi.register(), res);
});

router.get('/radio/create', function (req, res) {
  var gnUserId = ensureGnUserId(req, res);
  var artistName = req.query['artistName'];
  var seed = req.query['seed'];

  if (!artistName && !seed) {
    sendError(res, 'artistName or seed parameter missing');
  }

  if (!gnUserId || (!artistName && !seed)) {
    return;
  }
  if (seed) {
    request(rythmApi.createRadioBySeed(seed, gnUserId), res);
  } else {
    request(rythmApi.createRadio(artistName, gnUserId), res);
  }
});

//router.get('/radio/recommend', function (req, res) {
//	res.json(require('../src/radio/recommend.json'));
//});
//
//router.get('/radio/:radioId/:event/:trackId', function (req, res) {
//	console.log('Event: ' + req.params.event);
//	console.log('Radio ID: ' + req.params.radioId);
//	console.log('Track ID: ' + req.params.trackId);
//	res.json(require('../src/radio/create.json'));
//});

router.get('/stream/:trackId', function (req, res) {
  var oauth = new api.OAuth();
  var signedHqUrl = oauth.sign('https://stream.svc.7digital.net/stream/catalogue', {
    trackId: req.params.trackId,
    formatId: 56
  });
  var signedLqUrl = oauth.sign('https://stream.svc.7digital.net/stream/catalogue', {
    trackId: req.params.trackId,
    formatId: 55
  });
  res.json({
    hqUrl: signedHqUrl,
    hqFormat: 'AAC 160',
    lqUrl: signedLqUrl,
    lqFormat: 'HE-AAC 64'
  });
});

function requestFieldValue(req, res, field) {
  var gnUserId = ensureGnUserId(req, res);
  if (!gnUserId) {
    return;
  }
  var gnOptions = rythmApi.fieldvalues(field, gnUserId);
  request(gnOptions, res);
}

function ensureGnUserId(req, res) {
  return ensureQueryParam(req, res, 'gnUserId');
}

function ensureQueryParam(req, res, queryParamName) {
  var value = req.query[queryParamName];
  if (!value) {
    sendError(res, queryParamName + ' parameter missing');
  }
  return value;
}

function sendError(res, message) {
  res.status(500);
  res.send(message);
}

function request(options, res) {
  debug('(rythm-api) GET: https://' + options.host + options.path);
  var req = https.request(options, function (proxiedResponse) {
    processProxiedResponse(proxiedResponse, function (data) {
      res.send(data)
    });
  });
  req.on('error', function (err) {
    debug('(rythm-api) GET ERROR: https://' + options.host + options.path);
    debug(err);
    sendError(res, err);
  });
  req.setTimeout(5000, function (socket) {
    req.abort();
  });
  req.end();
}

function processProxiedResponse(proxiedResponse, onEnd) {
  var str = '';
  proxiedResponse.on('data', function (chunk) {
    str += chunk;
  });
  proxiedResponse.on('end', function () {
    onEnd(str);
  });
}

module.exports = router;
