var request = require('request')
  , _ = require('lodash')
  , API_URL = 'https://ci.appveyor.com/api/'
  ;

var toQueryString = function(obj) {
    return _.map(obj,function(v,k){
        return encodeURIComponent(k) + '=' + encodeURIComponent(v);
    }).join('&');
};

function AppVeyorClient(accountName, token, logLevel) {
    this.accountName = accountName;
    this._token = token;
    this._ll = logLevel || 0;
}

AppVeyorClient.API_URL = API_URL;

AppVeyorClient.prototype.request = function(method, command, params, callback) {
    var me = this
      , options
      , json = false
      , body = undefined
      , url = API_URL + command;

    // Allowing flexible param signature.
    if (! callback && typeof(params) == 'function') {
        callback = params;
        params = undefined;
    }

    if (method == 'POST') {
        json = true;
        body = params;
    } else if (params) {
        url = url + '?' + toQueryString(params);
    }

    options = {
        method: method
      , url: url
      , json: json
      , body: body
      , headers: {
          'Authorization': 'Bearer ' + this._token
        , 'Content-type': 'application/json'
      }
    };


    if (this._ll) {
        console.log('Request options:');
        console.log(options);
    }

    function responseHandler(error, response, body) {
        if (me._ll) {
            //console.log(response);
            console.log(response.headers);
            console.log(body);
        }
        if (callback) {
            if (!error && response.statusCode == 200) {
                var payload = body;
                if (method == 'GET') {
                    payload = JSON.parse(body);
                }
                callback(null, payload);
            } else if (!error && response.statusCode == 404) {
                var payload = body;
                if (method == 'GET') {
                    payload = JSON.parse(body);
                }
                callback(payload, response, body);
            } else {
                callback(error, response, body);
            }
        }
    }

    request(options, responseHandler);
};

/**
 * Expose a request get stream. The download request for artifacts
 * also requires the Bearer token.
 * @param url
 * @param options
 */
AppVeyorClient.prototype.requestGetStream = function(url, options) {
    options = Object.assign({}, options, {
        headers: {
            'Authorization': 'Bearer ' + this._token
            , 'Content-type': 'application/json'
        }
    });

    return request.get(url, options);
};

AppVeyorClient.prototype.get = function(command, params, callback) {
    this.request('GET', command, params, callback);
};

AppVeyorClient.prototype.post = function(command, params, callback) {
    this.request('POST', command, params, callback);
};


module.exports = AppVeyorClient;