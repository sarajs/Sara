var gulp = require('gulp')
  , mocha = require('gulp-mocha')
  , jshint = require('gulp-jshint')

/*!
 *
 * TEST WITH MOCHA
 *
 */

gulp.task('test', function () {
  gulp.src('test/*-test.js')
    .pipe(mocha({ ui: 'bdd' }))
})

/*!
 *
 * LINT WITH JSHINT
 *
 */

gulp.task('lint', function() {
  var linter = jshint({
        asi: true
      , laxcomma: true
      , boss: true
      , eqnull: true
      })
    , reporter = jshint.reporter('default')

  gulp.src('./lib/**/*.js')
    .pipe(linter)
    .pipe(reporter)
})

/*!
 *
 * DEFAULT
 *
 */


gulp.task('default', ['lint', 'test'])