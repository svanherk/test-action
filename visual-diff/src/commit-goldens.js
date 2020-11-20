#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const { createActionAuth } = require('@octokit/auth-action');

const octokit = new Octokit({
  auth: process.env['GITHUB_TOKEN'],
  baseUrl: process.env['GITHUB_API_URL'],
  userAgent: `${process.env['GITHUB_WORKFLOW']}-visual-diff`
});

const branchName = 'testing';

console.log(branchName);
