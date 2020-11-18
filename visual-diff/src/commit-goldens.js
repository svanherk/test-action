#!/usr/bin/env node

const git = require('simple-git')();

const token = process.env['GITHUB_TOKEN'];
const branchName = 'testing';

console.log(branchName);
