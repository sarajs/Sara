/*!
 *
 * A localStorage database adapter for Sara
 */

var _ = require('../sara/utils')
  , Readable = require('stream').Readable
  , es = require('event-stream')

module.exports = function adapterLocalStorage(Constructor, callback, Sara) {
  callback({
    find: function (obj) {
      return {
        stream: function () {
          var readable = new Readable()

          readable._read = function () { /* noop */ }

          Sara.request('/' + _.pluralize(Constructor.name) + '.json', function (res) {
            _(JSON.parse(res.toString('utf8'))).forEach(function (item) {
              readable.push(JSON.stringify(item))
            })
            readable.push(null)
            readable.emit('close')
          })

          return readable.pipe(es.parse())
        }
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
