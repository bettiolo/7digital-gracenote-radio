var gracenote = {};

// https://c{{URL_PREFIX}}.web.cddbp.net/webapi/
function RythmApi(clientId) {
	'use strict';
	var urlTemplate = 'https://c{{URL_PREFIX}}.web.cddbp.net/webapi/xml/1.0/{{METHOD}}?client={{CLIENT_ID}}';

	this._clientId = clientId;
	this._urlPrefix = clientId.split('-')[0];
	this._baseUrl = urlTemplate
		.replace('{{URL_PREFIX}}', this._urlPrefix)
		.replace('{{CLIENT_ID}}', this._clientId);

	RythmApi.prototype.register = function(appUserId) {
		var method = "register";
		var url = this._baseUrl.replace('{{METHOD}}', method);
		url += '&app_userid=' + appUserId;
		this._get(url, function(data) {
			console.log(data);
		});
	};

	RythmApi.prototype._get = function (url, callback) {
		var xmlHttp = new XMLHttpRequest(),
			_this = this;
		xmlHttp.onreadystatechange = function () {
			_this._processRequest(this, callback);
		};
		xmlHttp.open("GET", url, true);
		xmlHttp.send(null );
	};

	RythmApi.prototype._processRequest = function (xmlHttp, callback) {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200 )
		{
			if (xmlHttp.responseText == "Not found" )
			{
				// Not found
			}
			else
			{
				callback(xmlHttp.responseText);
			}
		}
	};
}

gracenote.RythmApi = RythmApi;