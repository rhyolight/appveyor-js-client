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
    this._accountName = accountName;
    this._token = token;
    this._ll = logLevel || 0;
}

AppVeyorClient.prototype.request= function(command, params, callback) {
    var me = this
      , options
      , url = API_URL + command;

    // Allowing flexible param signature.
    if (! callback) {
        callback = params;
        params = {};
    }

    if (params) {
        url = url + '?' + toQueryString(params);
    }

    options = {
        url: url,
        headers: {
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
        if (!error && response.statusCode == 200) {
            var payload = JSON.parse(body);
            callback(null, payload);
        } else {
            callback(error, response, body);
        }
    }

    request(options, responseHandler);
};

module.exports = AppVeyorClient;