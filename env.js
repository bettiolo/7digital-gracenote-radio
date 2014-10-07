function loadEnvironment(app) {
	'use strict';
	app.set('port', process.env.PORT || 3000);
	checkAndLoadEnvironment('GRACENOTE_CLIENT_ID', app);
	checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_KEY', app);
	checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_SECRET', app);
}

function checkAndLoadEnvironment(name, app) {
	if (!process.env[name]) {
		throw new Error(name + ' environment variable not set!')
	}
	app.set(name, process.env[name]);
}

module.exports = {
	load : loadEnvironment
};
