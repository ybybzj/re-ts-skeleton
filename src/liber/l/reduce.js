const each = require('./each');
const curry = require('../fn/curry');

function reduce(reducer, accu, o){
  let result = accu;
  each(function(v, k){
    result = reducer(result, v, k);
  }, o);

  return result;
}

module.exports = curry(3, reduce);
