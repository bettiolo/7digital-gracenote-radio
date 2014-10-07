var express = require('express');
var router = express.Router();

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
	res.json({
		url: 'http://api.7digital.com/1.2/stream?trackId=' + req.params.trackId
	});
});

module.exports = router;
