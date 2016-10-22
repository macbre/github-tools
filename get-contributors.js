#!/usr/bin/env node
/**
 * Usage:
 * ./get-contributors.js "project"
 *
 * Example:
 *  ./get-contributors.js macbre/phantomas
 */
var api = require('github'),
	log = require('npmlog'),
	format = require('util').format,
	github;

var argv = process.argv.slice(2),
	user = argv[0].split('/')[0],
	project = argv[0].split('/')[1];

log.info('GIT', 'Getting contributors of %s/%s', user, project);

github = new api({
	version: "3.0.0",
});

github.repos.getContributors({
	owner: user,
	repo: project
}, function(err, contributors) {
	if (err) {
		log.error('API', '#%d: %s', err.code, err.message);
		return;
	}

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
