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
            , key = _.pluralize(Constructor.name.toLowerCase())

          readable._read = function () { /* noop */ }

          if (~[null, '', false, undefined].indexOf(localStorage.getItem(key))) {
            get(function (res) {
              push(res.toString('utf-8'))
            })
          } else {
            push(localStorage.getItem(key))
            get()
          }

          return readable.pipe(es.parse())

          function get(cb) {
            Sara.request('/' + key + '.json', function (res) {
              localStorage.setItem(key, res.toString('utf-8'))
              if (cb instanceof Function) cb(res)
            })
          }

          function push(str) {
            _(JSON.parse(str)).forEach(function (item) {
              readable.push(JSON.stringify(item))
            })
            readable.push(null)
            readable.emit('close')
          }
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
