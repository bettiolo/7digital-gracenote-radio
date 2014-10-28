var querystring = require('querystring');

function RythmApi(clientId) {
	'use strict';
	var hostTemplate = 'c{{URL_PREFIX}}.web.cddbp.net';
	var pathTemplate = '/webapi/json/1.0/{{METHOD}}?client={{CLIENT_ID}}';

	this._clientId = clientId;
	this._hostPrefix = clientId.split('-')[0];
	this._host = hostTemplate.replace('{{URL_PREFIX}}', this._hostPrefix);
	this._pathTemplate = pathTemplate.replace('{{CLIENT_ID}}', this._clientId);

	RythmApi.prototype.register = function () {
		var method = "register";
		return this._createOptions(method);
	};

	RythmApi.prototype.fieldvalues = function (fieldName, userId) {
		var method = "fieldvalues";
		return this._createOptions(method, {
			fieldname: fieldName,
			user: userId
		});
	};

	RythmApi.prototype.createRadio = function (artistName, userId) {
    var method = "radio/create";
    return this._createOptions(method, {
      'artist_name': artistName,
      user: userId,
      'select_extended': 'cover,link',
      'return_count': '25',
      'filter_catalog': 'sevendigitalid'
    });
  };

  RythmApi.prototype.createRadioBySeed = function (seed, userId) {
    var method = "radio/create";
    return this._createOptions(method, {
      'seed': seed,
      user: userId,
      'select_extended': 'cover,link',
      'return_count': '25',
      'filter_catalog': 'sevendigitalid'
    });
  };

	RythmApi.prototype._createOptions = function (method, parameters) {
		var path = this._pathTemplate.replace('{{METHOD}}', method);
		if (parameters) {
			path += '&' + querystring.stringify(parameters);
		}
		return {
			host: this._host,
			path: path
		};
	}
}

module.exports = {
	RythmApi: RythmApi
};

