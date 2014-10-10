function RythmApi(clientId) {
	'use strict';
	var urlTemplate = 'https://c{{URL_PREFIX}}.web.cddbp.net/webapi/json/1.0/{{METHOD}}?client={{CLIENT_ID}}';

	this._clientId = clientId;
	this._urlPrefix = clientId.split('-')[0];
	this._baseUrl = urlTemplate
		.replace('{{URL_PREFIX}}', this._urlPrefix)
		.replace('{{CLIENT_ID}}', this._clientId);

	RythmApi.prototype.register = function(appUserId) {
		var method = "register";
		var url = this._baseUrl.replace('{{METHOD}}', method);
		url += '&app_userid=' + appUserId;
		return url;
	};

	RythmApi.prototype.fieldvalues = function(fieldName, userId) {
		var method = "fieldvalues";
		var url = this._baseUrl.replace('{{METHOD}}', method);
		url += '&fieldname=' + fieldName;
		url += '&user=' + userId;
		return url;
	};
}

module.exports = {
	RythmApi : RythmApi
};

