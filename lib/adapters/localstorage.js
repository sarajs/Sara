/*!
 *
 * A localStorage database adapter for Sara
 */

var _ = require('../sara/utils')
  , Sara = require('../sara')

module.exports = function adapterLocalStorage(Constructor, callback) {
  callback({
    find: function (query, callback) {
      if (callback) {
        var script = document.querySelector('[data-model="' + Constructor.name.toLowerCase() + '"][type="text/json"]')
        if (script) callback(null, _.retrocycle(JSON.parse(script.textContent)))
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
