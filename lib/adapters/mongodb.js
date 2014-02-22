/*!
 *
 * MONGODB SARA ADAPTER
 *
 */

var MongoClient = require('mongodb').MongoClient
  , _ = require('../sara/utils.js')

module.exports = function (Constructor, callback) {
  if (Constructor.app.db !== null) ready(null, Constructor.app.db)
  else MongoClient.connect('mongodb://127.0.0.1:27017/' + Constructor.app.name.toLowerCase(), ready)

  function ready(err, db) {
    Constructor.app.db = db

    if (err) throw err
    var collection = db.collection(Constructor.name)

    callback(_.bindAll({
      collection: collection
    , find: function (query, callback) {
        if (callback) {
          this.collection.find(query, function (err, docs) {
            if (err) callback(err, null)
            else {
              docs.toArray(function (err, docs) {
                callback(err, docs)
              })
            }
          })
        }
      }

    , insert: function (props, callback) {
        if (callback) this.collection.insert(props, function (err, docs) {
          callback(err, docs)
        })
      }

    , remove: function (query, callback) {
        if (callback) this.collection.remove(query, {}, callback)
      }

    , update: function (query, update, options, callback) {
        if (callback) this.collection.update(query, update, options, function (err) {
          if (err) throw err
        })
      }
    }))
  }
}
