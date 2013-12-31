/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

// FIXME: Another bastardization of JavaScript constructors. I need to write my own "[constructor Constructor]" which inherits from Function.

var _ = require('../utilities')

var Model = module.exports = (function ModelConstructor(name, schema) {

	var Constructor = (function Constructor(data) {
		
		this.id = this.constructor.app.history[name.pluralize()].filter(function () { return this.method = 'POST' }) + 1
		
	}).add('all', function () {
    
    var obj = {}
      , name = this._name.pluralize().toString()
    obj[name] = this.app.cache[name]
  	return obj
  
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
   
    return JSON.stringify(this.all())
    
  }).add(_.add)
    .add('_name', name)
    .add('_schema', schema)

	return Constructor

})