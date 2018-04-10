const {makeMiddlewares} = require('express-module-serv');
const cmdWrapper = require('express-module-serv/transformers/cmd-wrapper');
const addComma = require('express-module-serv/transformers/add-comma');
const tsCompiler = require('./ts-compiler');

const pUtil = require('path');



const transformers = [
  tsCompiler(),
  cmdWrapper(),
  addComma()
];

const modServConfig = {
  pathSettings: {
    base: pUtil.join(process.cwd() , 'src')
  },
  defaultFileExtensions: ['ts', 'js'],
  transformers: transformers,
  debug: true,
  // cacheControlExpiration: 10800, //default 0, set duration for expiration in seconds

  //default is true, set false in case you don't need rebuild when src file is updated, for example in production environment.
  reloadOnChange: true
};

module.exports = modServConfig;