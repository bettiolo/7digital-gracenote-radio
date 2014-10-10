var debug = require('debug')('app');
var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('../config');
// var gracenote = require('../src/gracenote');
var api = require('7digital-api').configure({
	consumerkey: config.sevendigitalConsumerKey,
	consumersecret: config.sevendigitalConsumerSecret,
	defaultParams: {
		country: 'us'
	}
});
var artists = new api.Artists();
// var rythmApi = new gracenote.RythmApi(config.gracenoteClientId);

router.get('/artist/search/:q', function (req, res) {
	artists.search({ q: req.params.q }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/:artistId/toptracks', function (req, res) {
	artists.getTopTracks({ artistid: req.params.artistId }, function(err, data) {
		res.json(data);
	});
});

router.get('/artist/:artistId/similar', function (req, res) {
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
//	var gnUserId = req.query.gnUserId;
//	if (!gnUserId) {
//		sendError(res, 'gnUserId querystring parameter missing')
//		return;
//	}
//	var url = rythmApi.fieldvalues('RADIOMOOD', gnUserId);
//	makeRythmGet(req, res, url);
});

router.get('/eras', function (req, res) {
	res.json(require('../src/radio/fieldvalues-radioera.json'));
});

router.get('/genres', function (req, res) {
	res.json(require('../src/radio/fieldvalues-radiogenre.json'));
});

router.get('/user/create/', function (req, res) {
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

function sendError(res, message) {
	res.status(500);
	res.send(message);
}
//
//var https = require('https');
//function makeRythmGet(req, res, url) {
//	debug('rythm-api-client: GET: ' + url);
//	var options = {
//		host: 'c15270144.web.cddbp.net',
//		path: '/webapi/json/1.0/fieldvalues?client=15270144-3DC024E66B0254D2BA0A7EC101AE1A35&fieldname=RADIOMOOD&user=259893991383018159-39A64AD6F62437A8ADF02A35F06DAEF1'
//	};
//
//	var callback = function(response) {
//		console.log('callback');
//		var str = '';
//		response.on('data', function (chunk) {
//			console.log('data ...');
//			str += chunk;
//		});
//		response.on('end', function () {
//			console.log('data OK');
//			res.status(200);
//			res.send(str);
//			// console.log(str);
//		});
//	};
//
//	https.request(options, callback).end();

//	request(url, function(err, internalResponse, body) {
//		console.log('WORKS');
//		res.send(body);
//		if (!err && internalResponse.statusCode == 200) {
//			res.status(200);
//			res.send(body);
//		} else {
//			if (internalResponse) {
//				res.status(internalResponse.statusCode);
//				if (body){
//					res.send(body);
//				} else {
//					res.send(err);
//				}
//			}
//		}
//	});
//}

module.exports = router;
