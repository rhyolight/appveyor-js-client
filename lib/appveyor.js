var _ = require('lodash')
  , AppVeyorClient = require('./client')
  , AppVeyorProject = require('./project');

function getToken(userToken) {
    var token = userToken;
    if (! token) {
        token = process.env['APPVEYOR_API_TOKEN'];
    }
    if (! token) {
        throw new Error("AppVeyor API Token must either be passed to " +
            "AppVeyor() constructor or set as the APPVEYOR_API_TOKEN " +
            "environment variable.");
    }
    return token;
}


function AppVeyor(accountName, token, debug) {
    if (! accountName) {
        throw new Error("AppVeyor account name must be passed to " +
            "AppVeyor() constructor.");
    }
    this._client = new AppVeyorClient(accountName, getToken(token), debug);
}

AppVeyor.prototype.getRoles = function(callback) {
    this._client.get('roles', callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-projects
 * @param callback
 */
AppVeyor.prototype.getProjects = function(callback) {
    var client = this._client;
    client.get('projects', function(err, payload) {
        if (err) return callback(err);
        callback(null, _.map(payload, function(projectData) {
            return new AppVeyorProject(projectData, client);
        }));
    });
};

module.exports = AppVeyor;