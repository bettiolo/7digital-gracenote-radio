var debug = require('debug')('app');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var stylus = require('stylus');
var socket = require('socket.io');
var env = require('./env');
var indexRoute = require('./routes/index');
var partialsRoute = require('./routes/partials');
var socketRoute = require('./routes/socket');

var app = express();

env.load(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

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

var server = app.listen(app.get('port'), function () {
	debug('Express server listening on port ' + server.address().port);
});

var io = socket(server);
io.on('connection', socketRoute);

module.exports = app;
