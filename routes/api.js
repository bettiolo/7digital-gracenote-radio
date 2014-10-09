var express = require('express');
var request = require('request');
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

router.get('/artist/search/:q', function (req, res) {
	artists.search({ q: req.params.q }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/toptracks/:artistId', function (req, res) {
	artists.getTopTracks({ artistid: req.params.artistId }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/similar/:artistId', function (req, res) {
	artists.getSimilar({ artistid: req.params.artistId }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/chart', function (req, res) {
	artists.getChart(function(err, data) {
		res.json(data);
	});
});

//router.get('/album/recommend/:artistid', function (req, res) {
//	releases.getRecommendations({ artistid: req.params.artistid }, function(err, data) {
//		res.json(data);
//	});
//});

router.get('/moods', function (req, res) {
	res.json(require('../src/radio/fieldvalues-radiomood.json'));
});

router.get('/eras', function (req, res) {
	res.json(require('../src/radio/fieldvalues-radioera.json'));
});

router.get('/genres', function (req, res) {
	res.json(require('../src/radio/fieldvalues-radiogenre.json'));
});

router.get('/user/create', function (req, res) {
	res.json(require('../src/register.json'));
});

router.get('/radio/create', function (req, res) {
	res.json(require('../src/radio/create.json'));
});

router.get('/radio/recommend', function (req, res) {
	res.json(require('../src/radio/recommend.json'));
});

router.get('/radio/:radioId/:event/:trackId', function (req, res) {
	console.log('Event: ' + req.params.event);
	console.log('Radio ID: ' + req.params.radioId);
	console.log('Track ID: ' + req.params.trackId);
	res.json(require('../src/radio/create.json'));
});

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

module.exports = router;
