#!/usr/bin/env node
/**
 * Usage:
 * ./get-contributors.js "project"
 *
 * Example:
 *  ./get-contributors.js macbre/phantomas
 */
const { Octokit } = require("@octokit/rest"),
	log = require('npmlog'),
	format = require('util').format;

var argv = process.argv.slice(2),
	user = argv[0].split('/')[0],
	project = argv[0].split('/')[1];

log.info('GIT', 'Getting contributors of %s/%s', user, project);

const github = new Octokit({
	version: "3.0.0",
});

github.paginate(github.repos.listContributors, {
	owner: user,
	repo: project
}).then(function(contributors) {
	log.info('API', 'Got %d contributor(s)', contributors.length);

	var ret = [];

	contributors.forEach(function(contributor) {
		ret.push(
			format('%s (https://github.com/%s)',
			contributor.login,
			contributor.login
		));
	});

	console.log(ret.join("\n"));
});
