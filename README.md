# AppVeyor Client for Node.js

[![NPM](https://nodei.co/npm/appveyor-js-client.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/appveyor-js-client/)


This is an incomplete API client for the [AppVeyor API](http://www.appveyor.com/docs/api).

## Installation

    npm install appveyor-js-client

## Requirements

You must have an AppVeyor account. To run the client, you'll need your AppVeyor account name and API token, which you can get at <https://ci.appveyor.com/api-token>.

You may either pass your AppVeyor API token into the `AppVeyor()` constructor or set it as an environment variable `APPVEYOR_API_TOKEN`.

## Usage

### Create a client

```
var AppVeyor = require('appveyor-js-client'),
    appveyor = new AppVeyor('account-name', 'api-token');
```

### Get Projects

```
appveyor.getProjects(function(err, projects) {
    console.log(projects);
});
```

### Using Project API

Each project returned is an [`AppVeyorProject`](lib/project.js) object with the following functions:

- [`getLastBuild(callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-last-build)
- [`getLastBuildBranch(branch, callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-last-branch-build)
- [`getBuildByVersion(version, callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-build-by-version)
- [`getHistory(options, callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-history)
- [`getDeployments(callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-deployments)
- [`getSettings(callback)`](http://www.appveyor.com/docs/api/projects-builds#get-project-settings)
- [`startBuildOfPullRequest(prId, callback)`](http://www.appveyor.com/docs/api/projects-builds#start-build-of-pull-request-github-only)

## Missing Features

Not all of the AppVeyor API is covered in this client. Feel free to add functionality in a pull request.

 * TODO: http://www.appveyor.com/docs/api/projects-builds#get-project-settings-in-yaml
 * TODO: http://www.appveyor.com/docs/api/projects-builds#add-project
 * TODO: http://www.appveyor.com/docs/api/projects-builds#update-project
 * TODO: http://www.appveyor.com/docs/api/projects-builds#update-project-settings-in-yaml
 * TODO: http://www.appveyor.com/docs/api/projects-builds#delete-project
 * TODO: http://www.appveyor.com/docs/api/projects-builds#start-build-of-specific-branch-commit
