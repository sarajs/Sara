/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

var _ = require('./utils')
  , Collection = require('./collection')
  , Datastore = require('./datastore')

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

  // Our constructor
  var Constructor = _.createNamedFunction(name, function (data) {
                      _(this).extend(this.constructor._schema)
                      _(this).extend(data)

                      // Init event
                      var initialize = this.constructor._initialize
                      if (initialize) initialize();
                    })

  // Our storage
  var db = new Datastore(Constructor)
    , dbready = false

  // A zero timeout ensures the Contructor has finished being created before the db call is made
  // FIXME: worst hack in all of Sara
  setTimeout(function () {
    // Load the db
    db.find({}, function (err, docs) {
      if (err) throw err

      if (docs.length) {
        docs.forEach(function (doc) {
          new Constructor(doc).push()
        })
      }

      dbready = true
    })
  })

  // Include _.method and _.add
  return _.class(Constructor)

  .add('collection', new Collection())

  /**
   * Get all models instances from memory.
   * @returns {Array|null}
   */
  .add(function all() {
    return this.collection
  })

  /**
   * Find a record by its 'id' attribute.
   * @param {Number} - id - A record id to query for.
   * @returns {Array|null}
   */
  .add(function find(id) {
    var records = this.all()
      , i = records.length
    while (i--) if (records[i].id === id) return records[i]
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
  .add('_schema', _.defaults(schema, { id: Number }))
  .add('_initialize', initialize)

  .method(function push() {
    var collection = this.constructor.all()
      , last

    last = collection[collection.length - 1]
    this.id = last ? last.id + 1 : 1
    collection.add(this)
  })

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  .method(function save() {
    this.push()

    // Write to disk
    db.find({ id: this.id }
           , function (err, docs) {
               if (err) throw err
               if (!docs.length) {

                 db.insert(this.data(), function () {
                   if (err) throw err
                 })
               }
             }.bind(this))
  })

  /**
   * Get/set
   */
  .method(function get(name) {
    return this[name]
  }).method(function set(name, value) {
    this[name] = value
    db.update({ id: this.id }, this.data())
    this.constructor.all().trigger('changeAny')
    this.trigger('change')
  })

  .method(function data() {
    return _.pick(this, _.keys(this.constructor._schema))
  })

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  .method(function destroy() {
    var collection = this.constructor.all()

    collection.remove(this)

    db.remove({ id: this.id }, function (err) { if (err) throw err })
  })

  .method('_events', {
    'change': []
  })
  .method('trigger', _.clone(Collection.prototype.trigger))
  .method('on', _.clone(Collection.prototype.on))
  .method('off', _.clone(Collection.prototype.off))
})