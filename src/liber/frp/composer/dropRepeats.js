var R = require('../rstream');
var curry = require('../../fn/curry');
function $dropRepeats(pred=(pre, cur)=>(pre === cur), s){
  var prevVal = "__$R_DropRepeat$_";
  return R.combine(function(s, self){
    if(!pred(s.val, prevVal)){
      self(s.val);
      prevVal = s.val;
    }

  }, [s]);
}
module.exports = curry(2, $dropRepeats);
