module.exports = function (grunt) {
  grunt.initConfig({
    develop: {
      server: {
        file: 'example/app.js'
      }
    }
  
  , jasmine: {
      test: {
        urls: [ 'http://localhost:1337' ]
      }
    }
  
  , uglify: {
      sara: {
        files: { 'sara.min.js': ['sara.js'] }
      , options: { mangle: true }
      }
    }
  })
  
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-develop')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  
  grunt.registerTask('test', ['develop', 'mocha'])
  
  grunt.registerTask('make', ['test', 'uglify'])
  
  grunt.registerTask('default', ['make'])
}