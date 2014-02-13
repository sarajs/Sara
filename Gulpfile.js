// Modules
var gulp = require('gulp')

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
  var mocha = require('gulp-mocha')

  gulp.src('test/*-test.js')
    .pipe(mocha({ ui: 'bdd' }))
})

/**
 * RUN WITH NODEMON
 */
gulp.task('develop', function () {
  var nodemon = require('gulp-nodemon')

  nodemon({ script: './examples/mustache-example/app', options: '-e html,js' })
    .on('restart', 'lint')
})

/**
 * DEFAULT
 */
gulp.task('default', ['lint', 'develop'])
