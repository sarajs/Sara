/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

var _ = require('./utils')
  , Collection = require('./collection')
  , adapterNeDB = require('../adapters/nedb')
  , adapterLocalStorage = require('../adapters/localstorage')
  , stream = require('stream')
  , Readable = stream.Readable
  , Writeable = stream.Writeable

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

  var app = this.constructor.app

  // Our constructor
  var Constructor = _.createNamedFunction(name, function (data) {
                      _(this).extend(this.constructor._schema)
                      _(this).extend(data)

                      // Init event
                      var initialize = this.constructor._initialize
                      if (initialize) initialize();
                    })

  Constructor.app = app
  app.resources[name] = Constructor
  app.dbstatus[name] = false

  // Start the DB
  var adapterServer = app.adapter || adapterNeDB
    , db

  if (IS_SERVER) adapterServer(Constructor, callback)
  else adapterLocalStorage(Constructor, callback)

  function callback(datastore) {
    db = datastore

    // Load the db
    setTimeout(function () {
      db.find({}, function (err, docs) {
        if (err) throw err
        if (docs.length) {
          docs.forEach(function (doc) {
            new Constructor(doc).push()
          })
        }

        app.dbstatus[name] = true
        // FIXME: awful hack on next line as well
        if (app.local && IS_CLIENT) app.local.tryInitRouter()
      })
    })
  }

  // JSON endpoints
  app.get('/' + name.toLowerCase() + '.json', function () {
    return Constructor.toJSON()
  })

  app.post('/' + name.toLowerCase() + '.json', function () {

  })

  app.get('/' + name.toLowerCase() + '/:id.json', function () {

  })

  app.put('/' + name.toLowerCase() + '/:id.json', function () {
  
  })

  // app.patch('/' + name.toLowerCase() + '/:id.json', function () {
  
  // })

  app.delete('/' + name.toLowerCase() + '/:id.json', function () {
  
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
    while (i--) if (records[i].id() === parseInt(id)) return records[i]
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
    return JSON.stringify(this.all())
  })

  // Schwag
  .add('_name', name)
  .add('_schema', schema)
  .add('_initialize', initialize)

  .method(function push(forward) {
    var collection = this.constructor.all()
      , last

    if (typeof this.id() !== 'number') {
      last = collection[collection.length - 1]
    }

    collection.add(this)
  })

  .method(function id() {
    return this.constructor.all().indexOf(this)
  })

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  .method(function save(forward) {
    if (forward !== false) forward = true
    this.push()

    if (forward) {
      this.constructor.app.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: this.constructor.app.clientId
      , type: 'add'
      , data: this.data()
      }))
    }

    // Write to disk
    db.find({ id: this.id() }, function (err, docs) {
      if (err) throw err
      
      if (!docs.length) {
        db.insert(this.data(), function (err, docs) {
          if (err) throw err
        })
      } else {
        db.update({ id: this.id() }, this.data(), {}, function () {
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
  }).method(function set(name, value, forward) {
    if (forward !== false) forward = true
    this[name] = value
    db.update({ _id: this._id }, this.data(), {}, function () {
    
    })
    this.constructor.all().trigger('changeAny')
    
    if (forward) {
      this.constructor.app.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: this.constructor.app.clientId
      , type: 'change'
      , id: this.id()
      , name: name
      , value: value
      }))
    }
    this.trigger('change')
  })

  .method(function data() {
    return _.pick(this, _.keys(this.constructor._schema))
  })

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  .method(function destroy(forward) {
    if (forward === undefined) forward = true

    var collection = this.constructor.all()

    if (forward) {
      this.constructor.app.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: this.constructor.app.clientId
      , type: 'remove'
      , id: this.id()
      }))
    }

    collection.remove(this)

    db.remove({ _id: this._id }, function (err) { if (err) throw err })
  })

  .method('_events', {
    'change': []
  })
  .method('trigger', _.clone(Collection.prototype.trigger))
  .method('on', _.clone(Collection.prototype.on))
  .method('off', _.clone(Collection.prototype.off))
})
