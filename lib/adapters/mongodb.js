/*!
 *
 * MONGODB SARA ADAPTER
 *
 */

var MongoClient = require('mongodb').MongoClient

module.exports = function (Constructor, callback) {
  MongoClient.connect('mongodb://127.0.0.1:27017/' + Constructor.name, function (err, db) {
    if (err) throw err
    var collection = db.collection(Constructor.name)

    callback({
      find: function (query, callback) {
        if (callback) {
          collection.find(query, function (err, docs) {
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
        if (callback) collection.insert(props, function (err, docs) {
          callback(err, docs)
        })
      }

    , remove: function (query, callback) {
        if (callback) collection.remove(query, {}, callback)
      }

    , update: function (query, update, options, callback) {
        if (callback) collection.update(query, update, options, function (err) {
          if (err) throw err
        })
      }
    })
  })
}
