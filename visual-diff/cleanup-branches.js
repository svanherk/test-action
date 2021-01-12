#!/usr/bin/env node

const chalk = require('chalk');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
	auth: process.env['GITHUB_TOKEN'],
	baseUrl: process.env['GITHUB_API_URL'],
	userAgent: `${process.env['GITHUB_WORKFLOW']}-visual-diff`
});

const [owner, repo] = process.env['GITHUB_REPOSITORY'].split('/');
const branchPrefix = process.env['VISUAL_DIFF_BRANCH_PREFIX'];

async function cleanupBranches() {
	const visualDiffBranches = await octokit.request('GET /repos/{owner}/{repo}/git/matching-refs/{ref}', {
		owner: owner,
		repo: repo,
		ref: `refs/heads/${branchPrefix}`
	});
	
	for (let i = 0; i < visualDiffBranches.length; i++) {
		const branch = visualDiffBranches[i];
		const prNum = branch.splice(branch.lastIndexOf('-') + 1);
		console.log(branch);
		console.log(prNum);
	};
}

cleanupBranches().catch((e) => {
	console.log(chalk.red(e));
	console.log(chalk.red('Could not cleanup orphaned visual diff branch(es).'));
});
