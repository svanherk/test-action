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
const goldensBranchName = process.env['VISUAL_DIFF_BRANCH'];

console.log(owner);
console.log(repo);
console.log(prBranchName);
console.log(prNum);
console.log(goldensBranchName);

async function openPR() {
  console.log(chalk.blue('\nVerifying PR information'));
  
  let prInfo;
  try {
    prInfo = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: owner,
      repo: repo,
      pull_number: prNum
    });
  } catch(e) {
    console.log(chalk.red('Could not find PR that triggered the visual-diff test run.'));
    return Promise.reject(e);
  }

  if (prInfo.data.head.ref !== prBranchName) {
    return Promise.reject('Branch name does not match what is expected.');
  } else if (prInfo.data.state !== 'open') {
    return Promise.reject('PR that triggered the visual-diff test run is no longer open.');      
  }
  
  console.log(chalk.blue('\nChecking For Existing Goldens PR'));
  
  const goldenPRs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: owner,
    repo: repo,
    head: `${owner}:refs/heads/${goldensBranchName}`,
    base: `refs/head/${prBranchName}`
  });

  if (goldenPRs.data.length === 0) {
    console.log('Goldens PR does not exist');
    console.log(chalk.blue('\nOpening new goldens PR'));
    const newPR = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: owner,
      repo: repo,
      title: `Updating Visual Diff Goldens for PR #${prNum}`
      head: `refs/heads/${goldensBranchName}`,
      base: `refs/head/${prBranchName}`
    });
    console.log(`PR #${newPR} opened`);
  } else {
    console.log(`Goldens PR already exists: ${goldenPRs.data[0].html_url}`);                                    
  } 
}

async function closePR() {

}
  
if (process.env['TEST_PASSED']) {
  openPR().then((result) => {
    console.log(result);
  }).catch((e) => {
    console.log(chalk.red(e));
    console.log(chalk.red('Could not open/update new goldens PR.'));
  });
} else {
  closePR().then((result) => {
    console.log(result);
  }).catch((e) => {
    console.log(chalk.red(e));
    console.log(chalk.red('Could not close existing goldens PR.'));
  });
}
