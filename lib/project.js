

function AppVeyorProject(projectData, apiClient) {
    this._data = projectData;
    this.accountName = projectData.accountName;
    this.projectSlug = projectData.slug;
    this.repoSlug = projectData.repositoryName;
    this._client = apiClient;
}

AppVeyorProject.prototype._getUrl = function() {
    return 'projects/' + this.accountName + '/' + this.projectSlug + '/';
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-last-build
 * @param callback
 */
AppVeyorProject.prototype.getLastBuild = function(callback) {
    this._client.get(this._getUrl(), callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-last-branch-build
 * @param branch
 * @param callback
 */
AppVeyorProject.prototype.getLastBuildBranch = function(branch, callback) {
    var url = this._getUrl() + 'branch/' + branch;
    this._client.get(url, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-build-by-version
 * @param version
 * @param callback
 */
AppVeyorProject.prototype.getBuildByVersion = function(version, callback) {
    var url = this._getUrl() + 'build/' + version;
    this._client.get(url, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-history
 * @param options
 * @param callback
 */
AppVeyorProject.prototype.getHistory = function(options, callback) {
    // Allowing flexible param signature.
    if (! callback) {
        callback = options;
        options = {};
    }
    if (! options) options = {};
    var url = this._getUrl() + 'history';
    // Set default recordsNumber option.
    if (! options.recordsNumber) {
        options.recordsNumber = 50;
    }
    this._client.get(url, options, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-deployments
 * @param callback
 */
AppVeyorProject.prototype.getDeployments = function(callback) {
    var url = this._getUrl() + 'deployments';
    this._client.get(url, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#get-project-settings
 * @param callback
 */
AppVeyorProject.prototype.getSettings = function(callback) {
    var url = this._getUrl() + 'settings';
    this._client.get(url, callback);
};

/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#get-project-settings-in-yaml
 */

/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#add-project
 */

/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#update-project
 */

/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#update-project-settings-in-yaml
 */

/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#delete-project
 */

/*
 * http://www.appveyor.com/docs/api/projects-builds#start-build-of-specific-branch-commit
 * @param branch
 * @param commitId
 * @param callback
 */
AppVeyorProject.prototype.startBuildOfSpecificBranchCommit = function(branch, commitId, callback) {
    var url = 'builds'
        , params = {
        accountName: this.accountName
        , projectSlug: this.projectSlug
        , branch: branch
        , commitId: commitId
    };
    this._client.post(url, params, callback);
};

/**
 * http://www.appveyor.com/docs/api/projects-builds#start-build-of-pull-request-github-only
 * @param prId
 * @param callback
 */
AppVeyorProject.prototype.startBuildOfPullRequest = function(prId, callback) {
    var url = 'builds'
      , params = {
          accountName: this.accountName
        , projectSlug: this.projectSlug
        , pullRequestId: prId
      };
    this._client.post(url, params, callback);
};


/*
 * TODO: http://www.appveyor.com/docs/api/projects-builds#cancel-build
 */


module.exports = AppVeyorProject;