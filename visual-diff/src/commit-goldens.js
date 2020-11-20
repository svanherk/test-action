#!/usr/bin/env node

const { Octokit } = require('@octokit/core');
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

async function confirmPR() {
  const result = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
    owner: owner,
    repo: repo,
    pull_number: prNum
  });
  if (result && result.head.ref === prBranchName) {
    return result;
  }
  console.log('not same');
  return reject('haha not same');
}
  

confirmPR().then((result) => {
  console.log(result);
}).catch((e) => {
  console.log(e);
});
