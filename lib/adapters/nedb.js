/*!
 * SARA-NEDB ADAPTER
 */

var NeDB = require('nedb')

module.exports = function (Constructor) {
  return new NeDB({ filename: Constructor.app.root + '/' + Constructor.name.toLowerCase() + '.db', autoload: true })
}
