var express = require('express');
var router = express.Router();
var config = require('../config');

var api = require('7digital-api').configure({
	consumerkey: config.sevendigitalConsumerKey,
	consumersecret: config.sevendigitalConsumerSecret,
	defaultParams: {
		country: 'us'
	}
});

router.get('/radio/moods', function (req, res) {
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
