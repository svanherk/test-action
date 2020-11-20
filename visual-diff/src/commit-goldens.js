#!/usr/bin/env node

const chalk = require('chalk');
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
  console.log('Verifying PR information');
  try {
    const result = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: owner,
      repo: repo,
      pull_number: prNum
    });
  } catch(e) {
    console.log(chalk.red('Could not find PR that triggered the visual-diff test run.'));
    return Promise.reject(e);
  }

  if (result.data.head.ref !== 'prBranchName') {
    return Promise.reject('Branch name does not match what is expected.');
  } else if (result.data.status !== 'open') {
    return Promise.reject('PR that triggered the visual-diff test run is no longer open.');      
  }
  
  console.log('Checking Out PR Branch');
  
}
  

confirmPR().then((result) => {
  console.log(result);
}).catch((e) => {
  console.log(chalk.red(e));
});
