#!/usr/bin/env node
/**
 * Usage:
 * ./get-issues.js "project" "milestone ID"
 *
 * Example:
 *  ./get-issues.js macbre/phantomas 7
 */
const { Octokit } = require("@octokit/rest"),
	log = require('npmlog'),
	format = require('util').format;

var argv = process.argv.slice(2),
	user = argv[0].split('/')[0],
	project = argv[0].split('/')[1],
	milestone = parseInt(argv[1], 10);

log.info('GIT', 'Getting closed issues from %s/%s for milestone #%d', user, project, milestone);

const github = new Octokit({
	version: "3.0.0",
});

github.paginate(github.issues.listForRepo, {
	owner: user,
	repo: project,
	milestone: milestone,
	state: 'closed',
	direction: 'asc'
}).then(function(issues) {
	var ret = [];

	issues.forEach(function(issue) {
		var type = (issue.labels[0] || {name: "pr"}).name; // .reduce((label, acc) => label.name);
		ret.push(format('* #%d `%s` - %s%s',
			issue.number,
			type,
			issue.title,
			(issue.user.login !== user ? (' (by @' + issue.user.login + ')') : '')
		));
	});

	console.log(ret.join("\n"));
});
