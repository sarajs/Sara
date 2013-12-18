/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

var _ = require('../utilities')

module.exports = (function Model(name, schema) {

	var Model = (function (data) {
		this._id = this.constructor._app.history[name.pluralize()].filter(function () { return this.method = 'POST' }) + 1
	})
	
	Model._name = name

	_.extend.call(Model, schema)

	return Model

}).add('all', function () {

	return this._app.cache[this._name]

}).add('find', function (id) {

	var records = this.all()
		, i = records.length

	while (i--) if (_.first.call(records[i]) === id) return records[i]
	
	return null

}).add('where', function (object) {
  
  var all = this.all()
    , records = []
		, i = all.length

	while (i--) {
	  var record = all[i]
	    , push = true
	
	  for (var attribute in object) if (record[attribute] !== object[attribute]) push = false
	  
	  if (push) records.push(record)
  }
	
	return records
  
}).add('toJSON', function () {

  var object = {}
  object[this._name] = this.all()

  return JSON.stringify(object)
  
}).add(_.add)