/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

var _ = require('./utils')

/**
 *
 * The constructor for a Sara model which returns a constructor.
 * @constructor
 * @param {String} - name - The of your constructor. (required)
 * @param {Object} - schema - A schema object made using attributes as keys and JS constants as values/.
 * @param {Function} - initialize - A function to execute when a model instance is created.
 * @returns {Function}
 *
 */
var Model = module.exports = (function ModelConstructor(name, schema, initialize) {

  // FIXME: Another bastardization of JavaScript constructors. I need to write my own "[constructor Constructor]" which inherits from Function.
  eval("var Constructor = function " + name + "(data) { _(this).extend(data); var initialize = this.constructor._initialize; if (initialize) initialize(); }")
  
  Constructor.method = _.method
  Constructor.add = _.add
  Constructor // For prototyping
  
  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  .method('save', function () {
    var collection = this.constructor.app.cache[_(name).pluralize()] || (this.constructor.app.cache[_(name).pluralize()] = [])
      , last
    if (collection) last = collection[collection.length - 1]
    this.id = last ? last.id + 1 : 1
    collection.push(this)
  })
  
  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  .method('destroy', function () {
    var collection = this.constructor.app.cache[_(name).pluralize()] || (this.constructor.app.cache[_(name).pluralize()] = [])
    collection.splice(collection.indexOf(this), 1)
  })
  
  /**
   * Get all models instances from memory.
   * @returns {Array|null}
   */
  .add('all', function () {
    return this.app.cache[_(name).pluralize()]
  })
  
  /**
   * Find a record by its 'id' attribute.
   * @param {Number} - id - A record id to query for.
   * @returns {Array|null}
   */
  .add('find', function (id) {
    var records = this.all()
      , i = records.length
    while (i--) if (_(records[i]).firstValue() === id) return records[i]
    return null
  })
  
  /**
   * Find a record by its attributes
   * @param {Object} - object - An object of the attributes to query for.
   */
  .add('where', function (object) {
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
  })
  
  /**
   * Get all the records in memory as a JSON string.
   * @returns {String}
   */
  .add('toJSON', function () {
    return JSON.stringify(this.all())
  })
  
  // Miscellanious goodies
  .add('_name', name)
  .add('_schema', schema)
  .add('_initialize', initialize)

  return Constructor

})