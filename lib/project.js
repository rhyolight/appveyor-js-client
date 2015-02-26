

function AppVeyorProject(projectData, apiClient) {
    this._data = projectData;
    this._client = apiClient;
}

AppVeyorProject.prototype._getUrl = function() {
    return 'projects/' + this._data.accountName + '/' + this._data.slug + '/';
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-last-build
 * @param callback
 */
AppVeyorProject.prototype.getLastBuild = function(callback) {
    this._client.request(this._getUrl(), callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-last-branch-build
 * @param branch
 * @param callback
 */
AppVeyorProject.prototype.getLastBuildBranch = function(branch, callback) {
    var url = this._getUrl() + 'branch/' + branch;
    this._client.request(url, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-build-by-version
 * @param version
 * @param callback
 */
AppVeyorProject.prototype.getBuildByVersion = function(version, callback) {
    var url = this._getUrl() + 'build/' + version;
    this._client.request(url, callback);
};

AppVeyorProject.prototype.getHistory = function(options, callback) {
    // Allowing flexible param signature.
    if (! callback) {
        callback = options;
        options = {};
    }
    if (! options) options = {};
    // /api/projects/{accountName}/{projectSlug}/history?recordsNumber={records-per-page}[&startBuildId={buildId}&branch={branch}]
    var url = this._getUrl() + 'history';
    // Set default recordsNumber option.
    if (! options.recordsNumber) {
        options.recordsNumber = 50;
    }
    this._client.request(url, options, callback);
};



module.exports = AppVeyorProject;