/*!
 *
 * DATASTORE
 * An isomorphic datastore for Sara
 *
 */

var NeDB = require('nedb')
  , _ = require('./utils')
  , path = require('path')

var Datastore = module.exports = (function Datastore(Constructor) {
  if (IS_SERVER) {
    return new NeDB({ filename: path.dirname(require.main.filename) + '/' + Constructor.name.toLowerCase() + '.db', autoload: true })
  } else if (IS_CLIENT) {
    return {
      find: function (props, callback) {
        var bootstrap = document.querySelectorAll('[type="text/json"]')
        window._ = _
        callback(null, _.retrocycle(JSON.parse(bootstrap[0].innerHTML)))
      }

    , insert: function (props, callback) {
        callback(null, [])
      }

    , remove: function (props, callback) {
        callback(null, [])
      }
    }
  }
})