// Modules
var gulp = require('gulp')
  , mocha = require('gulp-mocha')
  , nodemon = require('gulp-nodemon')
  , soften = require('gulp-soften')

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

gulp.task('soften', function () {
  gulp.src('./lib/**/*.js')
    .pipe(soften(2))
    .pipe(gulp.dest('./lib'))
})

/**
 * RUN WITH NODEMON
 */
gulp.task('develop', ['lint'], function () {
  nodemon({ script: './examples/react-example/app', ext: 'html js' })
    .on('restart', 'lint')
})

/**
 * RUN WITH NODEMON
 */
gulp.task('mustache', ['lint'], function () {
  nodemon({ script: './examples/mustache-example/app', ext: 'html js' })
    .on('restart', 'lint')
})


/**
 * DEFAULT
 */
gulp.task('default', ['lint', 'develop'])
