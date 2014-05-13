/*!
 *
 * A localStorage database adapter for Sara
 */

var _ = require('../sara/utils')
  , Readable = require('stream').Readable
  , through = require('through')

module.exports = function adapterLocalStorage(Constructor, callback, Sara) {
  callback({
    find: function (obj) {
      return {
        stream: function () {
          var readable = new Readable()
            , key = _.pluralize(Constructor.name.toLowerCase())
            , keyStamp = key + 'Stamp'

          readable._read = function () { /* noop */ }

          if (!localStorage.getItem(key)) {
            get(function (res) {
              push(res.toString('utf-8'))
            })
          } else {
            push(localStorage.getItem(key))
            var stamp = new Date(parseInt(localStorage.getItem(keyStamp)))
            if (stamp.toString() === 'Invalid Date' || Date.now() > stamp.getTime() + 3600000) get()
          }

          return readable.pipe(through(function (data) {
            var obj
            try {
              if (data) obj = JSON.parse(data.toString())
            } catch (err) {
              return console.error(err, 'attemping to parse:', data)
            }
            if (obj !== undefined) this.emit('data', obj)
          }))

          function get(cb) {
            Sara.request('/' + key + '.json', function (res) {
              localStorage.setItem(key, res.toString('utf-8'))
              localStorage.setItem(keyStamp, Date.now())
              if (cb instanceof Function) cb(res)
            })
          }

          function push(str) {
            try {
              _(JSON.parse(str)).forEach(function (item) {
                readable.push(JSON.stringify(item))
              })
              readable.push(null)
              readable.emit('close')
            } catch (e) {
              get(function (res) {
                push(res.toString('utf-8'))
              })
            }
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
