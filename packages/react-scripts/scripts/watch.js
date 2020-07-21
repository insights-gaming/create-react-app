'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const
  fs = require('fs-extra'),
  webpack = require('webpack'),
  configFactory = require('../config/webpack.overwolf.config'),
  paths = require('../config/paths'),
  checkRequiredFiles = require('react-dev-utils/checkRequiredFiles'),
  printBuildError = require('react-dev-utils/printBuildError');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Generate configuration
const config = configFactory('development');

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
fs.emptyDirSync(paths.appBuild);

// Merge with the public folder
fs.copySync(paths.appPublic, paths.appBuild, {
  dereference: true,
  filter: file => file !== paths.appHtml
});

let i = 0;

// Start the webpack build
webpack(config).watch({ ignored: /node_modules/ }, err => {
  if ( err ) {
    printBuildError(err);
  } else {
    i++;
    console.log(`Compiled successfully: ${i}`);
  }
});
