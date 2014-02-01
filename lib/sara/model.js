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
          new Constructor(doc).save()
        })
      }

      // FIXME: another major hack
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
  .add('_schema', schema)
  .add('_initialize', initialize)

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  .method(function save() {
    var pluralized = _(name).pluralize()
      , collection = this.constructor.all()
      , last
      , flag = true
      , that = this

    // setInterval(function () {
    //   if (dbready && flag) {
    //     flag = false

        last = collection[collection.length - 1]
        that.id = last ? last.id + 1 : 1
        collection.add(that)

        // Write to disk
        db.find({ id: that.id }, function (err, docs) {
          if (err) throw err

          if (!docs.length) db.insert(that, function () {
                              if (err) throw err
                            })
        })
    //   }
    // }, 10)
  })

  /**
   * Get/set
   */
  .method(function get(name) {
    return this[name]
  }).method(function set(name, value) {
    this[name] = value
    this.trigger('change')
  })

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  .method(function destroy() {
    var collection = this.constructor.all()
    collection.splice(collection.indexOf(this), 1)

    db.remove(this, function (err) { if (err) throw err })

    if (this._events.remove) this._events.remove()
  })

  .method('_events', Collection.prototype._events)
  .method(Collection.prototype.trigger)
  .method(Collection.prototype.on)
  .method(Collection.prototype.off)
})