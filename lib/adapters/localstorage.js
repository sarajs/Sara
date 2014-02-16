/*!
 *
 * A localStorage database adapter for Sara
 */

var _ = require('../sara/utils')

module.exports = function adapterLocalStorage(Constructor, callback) {
  callback({
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
  })
}
