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

router.get('/artist/toptracks/:artistid', function (req, res) {
	artists.getTopTracks({ artistid: req.params.artistid }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/similar/:id', function (req, res) {
	artists.getSimilar({ artistid: req.params.artistid }, function(err, data) {
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

router.get('/radio/moods', function (req, res) {
//	var rythmApi = new gracenote.RythmApi(config.gracenoteClientId);
//	rythmApi.fieldvalues('RADIOMOOD', '')
//	request('http://www.google.com', function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(body) // Print the google web page.
//		}
//	})

	res.json([
		'MOOD1',
		'MOOD2',
		'MOOD3'
	]);
});

router.get('/radio/eras', function (req, res) {
	res.json([
		'1990\'s',
		'2000\'s',
		'2010\'s'
	]);
});

router.get('/radio/genres', function (req, res) {
	res.json([
		'pop',
		'dance',
		'folk'
	]);
});

router.get('/radio/stream/:trackId', function (req, res) {
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
