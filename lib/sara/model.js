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
function Model(name, schema, initialize) {

  var app = this.constructor.app

  schema.id = 0

  // Our constructor
  var Constructor = _.createNamedFunction(name, function (data) {
                      _(this).extend(this.constructor._schema)
                      var last = this.constructor.last()
                      this.id = last ? last.id + 1 : 1
                      _(this).extend(data)
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
  else if (IS_CLIENT) adapterLocalStorage(Constructor, callback)

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
        if (IS_CLIENT) app.tryInitRouter()
      })
    })
  }

  // JSON endpoints
  app.get('/' + name.toLowerCase() + '.json', function () {
    return Constructor.toJSON()
  })
  // .post('/' + name.toLowerCase() + '.json', function () {
  // }).get('/' + name.toLowerCase() + '/:id.json', function () {
  // }).put('/' + name.toLowerCase() + '/:id.json', function () {
  // }).patch('/' + name.toLowerCase() + '/:id.json', function () {
  // }).delete('/' + name.toLowerCase() + '/:id.json', function () {  
  // })


  Constructor.collection = new Collection()

  /**
   * Get all models instances from memory.
   * @returns {Array|null}
   */
  Constructor.all = function () {
    return this.collection
  }

  /**
   * Find a record by its 'id' attribute.
   * @param {Number} - id - A record id to query for.
   * @returns {Array|null}
   */
  Constructor.find = function (id) {
    var records = this.all()
      , i = records.length
    while (i--) if (records[i].id === parseInt(id)) return records[i]
    return null
  }
  
  Constructor.first = function () {
    var records = this.all()
    return records[0]
  }

  Constructor.last = function () {
    var records = this.all()
    return records[records.length - 1]
  }
  
  /**
   * Find a record by its attributes
   * @param {Object} - object - An object of the attributes to query for.
   * @returns {Array}
   */
  Constructor.where = function (object) {
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
  }

  /**
   * Get all the records in memory as a JSON string.
   * @returns {String}
   */
  Constructor.toJSON = function () {
    return JSON.stringify(this.all())
  }

  // Schwag
  Constructor._name = name
  Constructor._schema = schema
  Constructor._initialize = initialize

  Constructor.prototype.push = function (forward) {
    var collection = this.constructor.all()
      , last

    if (typeof this.id !== 'number') {
      last = collection[collection.length - 1]
    }

    collection.add(this)
  }

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  Constructor.prototype.save = function (forward) {
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
    db.find({ id: this.id }, function (err, docs) {
      if (err) throw err
      
      if (!docs.length) {
        db.insert(this.data(), function (err, docs) {
          if (err) throw err
        })
      } else {
        db.update({ id: this.id }, this.data(), {}, function () {
          if (err) throw err
        })
      }
    }.bind(this))
  }

  /**
   * Get/set
   */
  Constructor.prototype.get = function (name) {
    return this[name]
  }

  Constructor.prototype.set = function (name, value, forward) {
    if (forward !== false) forward = true
    this[name] = value
    db.update({ id: this.id }, this.data(), {}, function () {
    
    })
    this.constructor.all().trigger('changeAny')
    
    if (forward) {
      this.constructor.app.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: this.constructor.app.clientId
      , type: 'change'
      , id: this.id
      , name: name
      , value: value
      }))
    }
    this.trigger('change')
  }

  Constructor.prototype.data = function () {
    return _.pick(this, _.keys(this.constructor._schema))
  }

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  Constructor.prototype.destroy = function (forward) {
    if (forward === undefined) forward = true

    var collection = this.constructor.all()

    if (forward) {
      this.constructor.app.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: this.constructor.app.clientId
      , type: 'remove'
      , id: this.id
      }))
    }

    collection.remove(this)

    db.remove({ id: this.id }, function (err) { if (err) throw err })
  }

  Constructor.prototype._events = {
    'change': []
  }

  Constructor.prototype.trigger = _.clone(Collection.prototype.trigger)
  Constructor.prototype.on = _.clone(Collection.prototype.on)
  Constructor.prototype.off = _.clone(Collection.prototype.off)

  return Constructor
}

module.exports = Model
