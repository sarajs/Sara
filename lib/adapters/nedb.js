/*!
 * SARA-NEDB ADAPTER
 */

var NeDB = require('nedb')

module.exports = function (Constructor) {
  var Sara = require('../sara')
  console.log('Connected to NeDB Database, ' + Constructor.name.toLowerCase() + '.')
  return new NeDB({ filename: Sara.root + '/' + Constructor.name.toLowerCase() + '.db', autoload: true })
}
