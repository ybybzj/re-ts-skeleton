const BrowserSync = require('browser-sync')
const makeMiddlewares = require('../browserSync-mw/moduleServ')
const pUtil = require('path')
const modServConfig = {
  pathSettings: {
    base: pUtil.join(process.cwd(), 'src'),
  },
}

module.exports = function(gulp) {
  gulp.task('serve', function() {
    var bs = BrowserSync.create()
    bs.init({
      ui: false,
      files: [
        './src/**/*.{js|ts|tsx}',
        './statics/**/*.*',
        // "./css/*.css",
        // "../src/**/*.js"
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
