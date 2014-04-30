/*!
 *
 * MONGODB SARA ADAPTER
 *
 */

var MongoClient = require('mongodb').MongoClient
  , _ = require('../sara/utils.js')

module.exports = function (url) {
  return function (Constructor, callback) {
    var Sara = require('../sara')  
    url = url || 'mongodb://127.0.0.1:27017/' + Sara.name.toLowerCase()
    if (Sara.db === null) MongoClient.connect(url, ready)
    else ready(null, Sara.db)

    function ready(err, db) {
      Sara.db = db
      if (err) throw err
      var collection = db.collection(Constructor.name)

      callback(collection)
    }
  }
}
