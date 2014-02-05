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
      find: function (query, callback) {
        if (callback) {
          var bootstrap = document.querySelectorAll('[type="text/json"]')
          callback(null, _.retrocycle(JSON.parse(bootstrap[0].innerHTML)))
        }
      }

    , insert: function (props, callback) {
        if (callback) callback(null, [])
      }

    , remove: function (query, callback) {
        if (callback) callback(null, [])
      }

    , update: function (query, update, options, callback) {
        if (callback) callback(null, [])
      }
    }
  }
})