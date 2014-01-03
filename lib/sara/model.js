/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

// FIXME: Another bastardization of JavaScript constructors. I need to write my own "[constructor Constructor]" which inherits from Function.

var Model = module.exports = (function ModelConstructor(name, schema, initialize) {

  var _ = require('../utilities')

  eval("var Model = function " + name + "(data) { _.extend.call(this, data); var initialize = this.constructor._initialize; if (initialize) initialize(); }")
  
  // Instance methods
  Model.method('save', function () {
    
    var collection = this.constructor.app.cache[_.pluralize(name)] || (this.constructor.app.cache[_.pluralize(name)] = [])
    
    if (collection) var last = collection[collection.length - 1]
    
    this.id = last ? last.id + 1 : 1
    
    collection.push(this)
    
  }).method('destroy', function () {
    
    var collection = this.constructor.app.cache[_.pluralize(name)] || (this.constructor.app.cache[_.pluralize(name)] = [])
    
    collection.splice(collection.indexOf(this), 1)
    
  })
  
  // Model methods (like what a backbone collection has)
  Model.add('all', function () {
    
    return this.app.cache[_.pluralize(this._name).toString()]
  
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
    .add('_initialize', initialize)

  return Model

})