const t = require('./type');

module.exports = function isEmpty(o){
  switch(t(o)){
    case 'undefined':
    case 'null':
    case 'NaN':
      return true;
    case 'array':
    case 'string':
      return o.length === 0;
    case 'object':
      return Object.keys(o).length === 0;
    default:
      return false;
  }
};