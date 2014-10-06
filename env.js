var express = require('express');

var app = express();

function loadEnvironment() {
	'use strict';

	checkAndLoadEnvironment('GRACENOTE_CLIENT_ID');
	checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_KEY');
	checkAndLoadEnvironment('SEVENDIGITAL_CONSUMER_SECRET');
}

function checkAndLoadEnvironment(name) {
	if (!process.env[name]) {
		throw new Error(name + ' environment variable not set!')
	}
	app.set(name, process.env[name]);
}

module.exports = {
	load : loadEnvironment
};
