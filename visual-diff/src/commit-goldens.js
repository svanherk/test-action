#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
//const { createActionAuth } = require('@octokit/auth-action');

const octokit = new Octokit({
  auth: process.env['GITHUB_TOKEN'],
  baseUrl: process.env['GITHUB_API_URL'],
  userAgent: `${process.env['GITHUB_WORKFLOW']}-visual-diff`
});

const [owner, repo] = process.env['GITHUB_REPOSITORY'].split('/');
const prBranchName = process.env['PULL_REQUEST_BRANCH'];
const prNum = process.env['PULL_REQUEST_NUM']
const goldensBranchName = `visual-diff-${prNum}`;

console.log(owner);
console.log(repo);
console.log(prBranchName);
console.log(prNum);
console.log(goldensBranchName);

const getPR = async() => {
  const result = await octokit.pulls.get({
    owner,
    repo,
    prNum
  });
  return result;
}
  

getPR().then((result) => {
  console.log(result);
});
