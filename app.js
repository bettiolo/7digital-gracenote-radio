var config = require('./config');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var stylus = require('stylus');
var bodyParser = require('body-parser');
var apiRoute = require('./routes/api');
var partialsRoute = require('./routes/partials');
var indexRoute = require('./routes/index');
var app = express();
var allowedRadioIps = config.allowedRadioIPs.split(',');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/media', express.static(path.join(__dirname, 'public/media')));
app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));
app.use('/bower_components', express.static(path.join(__dirname, 'public/bower_components')));

app.use(function(req, res, next) {
	var forwardedFor = req.headers['x-forwarded-for'];
	if (forwardedFor) {
		forwardedFor = forwardedFor.split(',')[0];
	}
	var ip = req.connection.remoteAddress;
	var proxyMatch;
	if (forwardedFor) {
		proxyMatch = allowedRadioIps.indexOf(forwardedFor) > -1
	}
	var ipMatch = allowedRadioIps.indexOf(ip) > -1;
	if (!proxyMatch && !ipMatch) {
		var errorString =
			'X-Forwarded-For: ' + forwardedFor +
			' or Client IP ' + ip + ' not authorised. Ask to add your IP to the white list (ALLOWED_RADIO_IPS)';
		console.error(errorString);
		var err = new Error(errorString);
		err.status = 401;
		next(err);
	} else {
		next();
	}
});

app.use('/api', apiRoute);
app.use('/partials', partialsRoute);
app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
