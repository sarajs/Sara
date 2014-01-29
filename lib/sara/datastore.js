/*!
 *
 * DATASTORE
 * An isomorphic datastore for Sara
 *
 */

var NeDB = require('nedb')

var Datastore = module.exports = (function Datastore(Constructor) {
  if (IS_SERVER) {
    return new NeDB({ filename: './' + Constructor.name.toLowerCase() + '.db', autoload: true })
  } else if (IS_CLIENT) {
    return {
      find: function (props, callback) {
        callback(null, [])
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