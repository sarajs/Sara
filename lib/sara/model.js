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

  // Include _.method and _.add
  return _.class(Constructor)

  /**
   * Get all models instances from memory.
   * @returns {Array|null}
   */
  .add(function all() {
    var pluralized = _(name).pluralize()
      , cache = this.app.cache[pluralized] || (this.app.cache[pluralized] = [])

    return _.cloneDeep(cache)
  })

  /**
   * Find a record by its 'id' attribute.
   * @param {Number} - id - A record id to query for.
   * @returns {Array|null}
   */
  .add(function find(id) {
    var records = this.all()
      , i = records.length
    while (i--) if (_(records[i]).firstValue() === id) return records[i]
    return null
  })

  /**
   * Find a record by its attributes
   * @param {Object} - object - An object of the attributes to query for.
   * @returns {Array}
   */
  .add(function where(object) {
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
  .add(function toJSON() {
    return JSON.stringify(this.constructor.all())
  })

  // Schwag
  .add('_name', name)
  .add('_schema', schema)
  .add('_initialize', initialize)

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  .method(function save() {
    var pluralized = _(name).pluralize()
      , collection = this.constructor.app.cache[pluralized] || (this.constructor.app.cache[pluralized] = [])
      , last
    if (collection) last = collection[collection.length - 1]
    this.id = last ? last.id + 1 : 1
    collection.push(this)
  })

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  .method(function destroy() {
    var collection = this.constructor.all()
    collection.splice(collection.indexOf(this), 1)
  })

})