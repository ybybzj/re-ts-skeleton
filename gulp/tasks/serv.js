const BrowserSync = require('browser-sync')
const makeMiddlewares = require('../browserSync-mw/moduleServ')
const pUtil = require('path')


module.exports = function(gulp, _, Cfg) {
  const tsConfig = Cfg.tsConfig || {}
  const pathSettings = pathSettingsFromTsCfg(tsConfig.compilerOptions)
  const modServConfig = pathSettings ? {
    pathSettings: pathSettings
  } : null
  
  gulp.task('serve', function() {
    var bs = BrowserSync.create()
    bs.init({
      ui: false,
      files: [
        './src/**/*.{js|ts|tsx}',
        './statics/**/*.*',
      ],
      server: {
        baseDir: 'statics',
        index: 'index.html',
        serveStaticOptions: {
          extensions: ['html'],
        },
      },
      port: 4000,
      middleware: makeMiddlewares(modServConfig).map(
        ({ route, middleware }) => {
          return {
            route,
            handle: middleware,
          }
        }
      ),
    })
  })
}


function pathSettingsFromTsCfg(tsCompileOpts) {
  if(tsCompileOpts == null || (tsCompileOpts.baseUrl == null && tsCompileOpts.paths == null)) {
    return null
  }
  const pathSettings = {}
  if(tsCompileOpts.baseUrl) {
    pathSettings.baseUrl = pUtil.resolve(process.cwd(), tsCompileOpts.baseUrl)
  }

  if(tsCompileOpts.paths) {
    pathSettings.paths = Object.keys(tsCompileOpts.paths).reduce((m, k)=>{
      const _k = normalizePattern(k)
      const path = normalizePattern(tsCompileOpts.paths[k][0])
      m[_k] = path
      return m
    }, {})
  }

  return pathSettings
}

function normalizePattern(s) {
  s = s.trim()
  const l = s.length
  if(s.lastIndexOf('/*') === l - 2) {
    s = s.slice(0, l - 2)
  }
  return s
}