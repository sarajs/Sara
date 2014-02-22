// Modules
var gulp = require('gulp')
  , mocha = require('gulp-mocha')
  , nodemon = require('gulp-nodemon')

/**
 * LINT WITH JSHINT
 */
gulp.task('lint', function() {
  var jshint = require('gulp-jshint')
    , linter = jshint({
        asi: true
      , laxcomma: true
      , boss: true
      , eqnull: true
      , noarg: true
      , evil: true
      })
    , reporter = jshint.reporter('default')


 gulp.src('./lib/**/*.js')
    .pipe(linter)
    .pipe(reporter)
})

/**
 * TEST WITH MOCHA
 */
gulp.task('test', function () {
  gulp.src('test/*-test.js')
    .pipe(mocha({ ui: 'bdd' }))
})

/**
 * RUN WITH NODEMON
 */
gulp.task('develop', function () {
  nodemon({ script: './examples/mustache-example/app', ext: 'html js' })
    .on('restart', 'lint')
})

/**
 * DEFAULT
 */
gulp.task('default', ['lint', 'develop'])
