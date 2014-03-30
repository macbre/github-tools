#!/usr/bin/env node
/**
 * Usage:
 * ./get-issues.js "project" "milestone ID"
 *
 * Example:
 *  ./get-issues.js macbre/phantomas 7
 */
var api = require('github'),
	log = require('npmlog'),
	format = require('util').format,
	github;

var argv = process.argv.slice(2),
	user = argv[0].split('/')[0],
	project = argv[0].split('/')[1],
	milestone = parseInt(argv[1], 10);

log.info('GIT', 'Getting closed issues from %s/%s for milestone #%d', user, project, milestone);

github = new api({
	version: "3.0.0",
});

github.issues.repoIssues({
	user: user,
	repo: project,
	milestone: milestone,
	state: 'closed',
	direction: 'asc'
}, function(err, issues) {
	if (err) {
		log.error('API', '#%d: %s', err.code, err.message);
		return;
	}

	var ret = [];

	issues.forEach(function(issue) {
		ret.push(format('* #%d - %s%s',
			issue.number,
			issue.title,
			(issue.user.login !== user ? (' (by @' + issue.user.login + ')') : '')
		));
	});

	console.log(ret.join("\n"));
});
