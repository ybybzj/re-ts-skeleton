
// @ts-check
const ts = require('typescript');
const pUtil = require('path');

const tsCompileCfg = {
  module: ts.ModuleKind.CommonJS,
  "moduleResolution": "node",
  "removeComments": true,
  "preserveConstEnums": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "strictNullChecks": true,
  "noImplicitThis": true,
  "noFallthroughCasesInSwitch": true,
  "jsx": true,
  "target": ts.ScriptTarget.ES5
};

module.exports = function tsCompiler(option={}){
  const compileOption = Object.assign({}, tsCompileCfg, option.compileOption);
  return {
    filter: function (fileObj){
      return ['.ts', '.tsx'].indexOf(pUtil.extname(fileObj.path)) > -1;
    },
    transformer: function(fileObj){
      return {
        path: fileObj.path,
        content: ts.transpileModule(fileObj.content, {
          compilerOptions: compileOption
        }).outputText
      };
    }
  }
};


