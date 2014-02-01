/*!
 *
 * VIEW
 *
 * Code here should make Sara adaptable to most view layers.
 *
 */

var Sara = require('../sara')

var View = module.exports = (function View(options) {
  if (!Sara.viewAdapter) throw new Error('No view adapter specified for Sara.')
  return Sara.viewAdapter.initializer(options)
})