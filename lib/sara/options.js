/*!
 *
 * OPTIONS
 *
 * A simple options parser for Sara.
 *
 */

var Options = module.exports = (function Options(argv) {
  argv = argv || process.argv

  for (var i = argv.length; i--;) {
    switch (argv[i]) {
      case '--env':
      case '--environment':
      case '-e':
        this.env = argv[i + 1]
    }
  }
})