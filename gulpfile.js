const fs = require('fs')
const pUtil = require('path')
const stripJsonComments = require('strip-json-comments')

require('gulp-load-dir')(require('gulp'), {
  tsConfig: readJsonFile('./tsconfig.json'),
})

function readJsonFile(jsonFile) {
  const fpath = pUtil.join(process.cwd(), jsonFile)
  if (isExist(fpath)) {
    const jsonStr = fs.readFileSync(fpath, { encoding: 'utf8' })
    return JSON.parse(stripJsonComments(jsonStr))
  } else {
    return null
  }
}

function isExist(path) {
  var stat
  try {
    stat = fs.statSync(path)
    return stat.isFile()
  } catch (e) {
    return false
  }
}
