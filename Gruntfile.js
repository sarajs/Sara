module.exports = function (grunt) {
  grunt.initConfig({
    jasmine: {
      test: {
        src: 'sara.js'
      , options: {
          specs: 'test/*-test.js'
        , helpers: 'test/*-helper.js'
        }
      }
    }
  
  , copy: {
      files: []
    }
  
  , uglify: {
      index: {
        files: { 'sara.min.js': ['sara.js'] }
      , options: { mangle: true }
      }
    }
  })
  
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  
  grunt.registerTask('default', ['jasmine', 'copy', 'uglify'])
}