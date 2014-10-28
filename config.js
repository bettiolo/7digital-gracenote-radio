function checkAndLoadEnvironment(name) {
	'use strict';
	if (!process.env[name]) {
		throw new Error(name + ' environment variable not set!')
	}
	return process.env[name];
}

module.exports = {
	port: process.env.PORT || 3000,
	gracenoteClientId: checkAndLoadEnvironment('GRACENOTE_CLIENT_ID'),
	sevendigitalConsumerKey: checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_KEY'),
	sevendigitalConsumerSecret: checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_SECRET'),
	allowedRadioIPs: process.env['ALLOWED_RADIO_IPS'] ? process.env['ALLOWED_RADIO_IPS'] : '127.0.0.1'
};
