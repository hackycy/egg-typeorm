'use strict';

const { sep } = require('path');


function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function getModelName(file) {
  const filename = file.split(sep).pop() || '';
  const name = capitalizeFirstLetter(filename.replace(/\.ts$|\.js$/g, ''));
  return name;
}

function formatPaths(files) {
  return files.map(file => {
    const name = getModelName(file);
    file = file.split(sep).join('/');
    const importPath = `../${file}`.replace(/\.ts$|\.js$/g, '');
    return {
      name,
      importPath,
    };
  });
}

function getConnectionOptions(config) {
  console.log(config);
}

module.exports = { capitalizeFirstLetter, getModelName, formatPaths, getConnectionOptions };
