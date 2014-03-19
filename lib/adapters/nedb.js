/*!
 * SARA-NEDB ADAPTER
 */

var NeDB = require('nedb')
  , path = require('path')

module.exports = function (Constructor) {
  var Sara = require('../sara')
  console.log('Connected to NeDB Database, ' + Constructor.name.toLowerCase() + '.')
  return new NeDB({ filename: path.dirname(Sara.root) + '/' + Constructor.name.toLowerCase() + '.db', autoload: true })
}
