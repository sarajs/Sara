/*!
 *
 * POSTGRESQL SARA ADAPTER
 *
 */

var pg = require('pg')
  , QueryStream = require('pg-query-stream')
  , _ = require('../sara/utils')

module.exports = function (url) {
  return function (Constructor, callback) {
    var Sara = require('../sara')  
    url = url || 'mongodb://127.0.0.1:27017/' + Sara.name.toLowerCase()

    if (Sara.db === null) pg.connect(url, ready)
    else ready(null, Sara.db)

    function ready(err, db, done) {
      Sara.db = db
      if (err) throw err
      var collectionName = _.pluralize(Constructor.name.toLowerCase())

      callback({
        find: function (obj) {
          obj = obj || {}

          return {
            stream: function () {
              var query = 'SELECT * FROM ' + collectionName
                , length = Object.keys(obj).length
                , i = 0
                , stream

              for (var name in obj) {
                var value = obj[name]

                if (i === 0) query += ' WHERE '
                query += '(' + name + '=' + value + ') '
                if (++i !== length) query += 'AND '
              }

              query = new QueryStream(query + ';')

              return db.query(query)
            }
          }
        }
      })
    }
  }
}
