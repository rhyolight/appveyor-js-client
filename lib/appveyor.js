var _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
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

/**
 * The build artifacts api is undocumented but there are powershell examples:
 * http://www.appveyor.com/docs/api/samples/download-artifacts-advanced-ps
 * The url for the download is added to each artifact object to use in the
 * downloadArtifact() api
 * @param jobId
 * @param callback
 */
AppVeyor.prototype.getArtifacts = function(jobId, callback) {
    var artifactEndpoint = 'buildjobs/' + jobId + '/artifacts' 
    var client = this._client;
    client.get(artifactEndpoint, function(err, payload) {
        if (err) return callback(err);
        payload = payload.map(artifact => Object.assign(artifact, {
            url: `${AppVeyorClient.API_URL}/buildjobs/${jobId}/artifacts/${artifact.fileName}`
        }))
        callback(null, payload);
    });
};

/**
 * The build artifacts api is undocumented but there are powershell examples:
 * http://www.appveyor.com/docs/api/samples/download-artifacts-advanced-ps
 * This download request provides the necessary Bearer token.
 * @param artifact {fileName, url}
 * @param destination
 * @param callback
 */
AppVeyor.prototype.downloadArtifact = function(artifact, destination, callback) {
    var client = this._client;
    var fileDestination = path.join(destination, artifact.fileName);

    try {
        client.requestGetStream(artifact.url)
            .on('error', function(err) {
                callback(err)
            })
            .on('end', function(){
                callback()
            })
            .pipe(fs.createWriteStream(fileDestination))
    } catch (error) {
        callback(err)
    }
};

module.exports = AppVeyor;