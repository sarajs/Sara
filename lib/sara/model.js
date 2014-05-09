/*!
 *
 * MODEL
 *
 * Instances of this class are models, and themselves constructors for model instances.
 *
 */

// Modules
var _ = require('./utils')
  , Collection = require('./collection')
  , stream = require('stream')
  , Readable = stream.Readable
  , Writable = stream.Writable
  , es = require('event-stream')

var IS_SERVER = !process.browser
  , IS_CLIENT = !!process.browser

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
  if (!(this instanceof Model)) return new Model(name, schema, initialize)

  var Sara = require('../sara')
    , lower = name.toLowerCase()
    , plural = _.pluralize(lower)

  schema.id = 0

  // Our constructor
  var Constructor = _.createNamedFunction(name, function (data, init) {
    if (_.typeOf(data) !== 'object') data = _.zipObject(_.keys(this.constructor._schema), Array.prototype.slice.call(arguments))

    data = _.defaults(data, this.constructor._schema)

    _(this).defaults(data)

    this.id = this.constructor.lastId++

    if (init !== false) {
      var initialize = this.constructor._initialize
      if (initialize instanceof Function) initialize.call(this);
    }
  })

  if (Sara.env !== 'production') global[name] = Constructor
  
  Sara.resources[name] = Constructor

  Constructor.lastId = 0

  // Hypermedia API
  Sara.get('/' + plural + '.json', function (req, res) {
    Constructor.all(function (collection) {
      res.end(collection.toJSON())
    })

  }).post('/' + plural + '/new.json', function (req, res) {

      req.body.completed = req.body.completed === 'on'
      var todo = new Todo({ title: req.body.title, completed: completed }).save()
      todo.toJSON().pipe(res)

    }).get('/' + plural + '/:id.json', function (req, res) {

      var record = Constructor.find(req.params.id)
      (record !== null ? record.toJSON() : 404)

    }).get('/' + plural + '/new.json', function () {

      return new Constructor().toJSON()

    })
    .put('/' + name.toLowerCase() + '/:id.json', updateRecord)
    .patch('/' + name.toLowerCase() + '/:id.json', updateRecord)
    .delete('/' + name.toLowerCase() + '/:id.json', function (id) {

      Constructor.find(id).destroy()
      return 404

    })

  function updateRecord() {
    req.body.completed = req.body.completed === 'on'
    var record = Constructor.find(req.params.id)
    if (record !== null) {
      _(req.body).forIn(function (value, key) {
        record.set(key, value)
      })

      return record.toJSON()
    } else return 404
  }

  Constructor.collection = new Collection()

  Constructor.write = function (method) {
    var writable = new Writable({ objectMode: true })
    writable._write = function (record, encoding, callback) {
      record[method]()
      callback()
    }
    return writable
  }

  Constructor.jsonContent = ''

  /**
   * Get all models instances from memory.
   * @returns {Array|null}
   */
  Constructor.all = function (callback) {
    if (callback instanceof Function) {
      var collection = new Collection()
      Constructor.db.find({}).stream()
        .on('data', function (item) {
          collection.add(new Constructor(item))
        })
        .on('error', function (err) {
          throw err
        })
        .on('close', function () {
          callback(collection)
        })
    } else {
      return Constructor.db.find().stream().pipe(es.map(function (data, callback) {
        callback(null, new Constructor(data))
      }))
    }
  }


  /**
   * Find a record by its 'id' attribute.
   * @param {Number} - id - A record id to query for.
   * @returns {Array|null}
   */
  Constructor.find = function (query, callback) {
    this.all(function (records) {
      if (typeof query === 'string') query = parseInt(query)
      if (typeof query === 'number') {
        var i = records.length
        while (i--) if (records[i].id === parseInt(query)) {
          callback(records[i])
          return true
        }
      } else if (query instanceof Object) {
        Constructor.where(query, function (items) {
          callback(items[0])
        })
      }
      return false
    })
  }
  
  Constructor.first = function (callback) {
    this.all(function (records) {
      callback(records[0])
    })
  }

  Constructor.last = function (callback) {
    this.all(function (records) {
      callback(records[records.length - 1])
    })
  }
  
  /**
   * Find a record by its attributes
   * @param {Object} - object - An object of the attributes to query for.
   * @returns {Array}
   */
  Constructor.where = function (object, callback) {
    this.all(function (all) {
      var records = []
      , i = all.length
      while (i--) {
        var record = all[i]
        , push = true
        for (var attribute in object) {
          var r = record[attribute] instanceof Function ? record[attribute]() : record[attribute]
          var q = object[attribute] instanceof Function ? object[attribute]() : object[attribute]
          if (r !== q) push = false
        }
        if (push) records.push(record)
      }
      callback(records)
    })
  }

  // Schwag
  Constructor._name = name
  Constructor._schema = schema
  Constructor._initialize = initialize

  Constructor.prototype.push = function (forward) {
    this.constructor.all(function (collection) {
      var last

      if (typeof this.id !== 'number') {
        last = collection[collection.length - 1]
      }

      collection.add(this)
      this.constructor.all(function (records) {
        this.constructor.jsonContent = records.toJSON()
      }.bind(this))
    }.bind(this))
    return this
  }

  /**
   * Save the model instance to memory.
   * @returns {undefined}
   */
  Constructor.prototype.save = function (forward) {
    if (Sara.initialized) {
      if (forward !== false) forward = true
      this.push()

      if (forward) {
        Sara.socket.send(JSON.stringify({
            resource: this.constructor.name
          , clientId: Sara.clientId
          , type: 'add'
          , data: this.data()
        }))
      }

      // Write to disk
      this.constructor.db.find({ id: this.id }, function (err, docs) {
        if (err) throw err
        
        if (!docs.length) {
          this.constructor.db.insert(this.data(), function (err, docs) {
            if (err) throw err
          })
        } else {
          this.constructor.db.update({ id: this.id }, this.data(), {}, function () {
            if (err) throw err
          })
        }
      }.bind(this))    
    } else console.warn('Attempted to save model before app initialization.')
    return this
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
    this.constructor.db.update({ id: this.id }, this.data(), {}, function () {
    
    })
    this.constructor.all(function (records) {
      records.trigger('changeAny')
      this.constructor.jsonContent = records.toJSON()
    })
    
    if (forward) {
      Sara.socket.send(JSON.stringify({
        resource: this.constructor.name
      , clientId: Sara.clientId
      , type: 'change'
      , id: this.id
      , name: name
      , value: value
      }))
    }
    this.trigger('change')
    return value
  }

  Constructor.prototype.data = function () {
    return _.pick(this, _.keys(this.constructor._schema))
  }

  Constructor.prototype.toJSON = function () {
    return JSON.stringify(this.data())
  }

  /**
   * Delete the model instance from memory.
   * @returns {undefined}
   */
  Constructor.prototype.destroy = function (forward) {
    if (forward === undefined) forward = true

    this.constructor.all(function (collection) {
      if (forward) {
        Sara.socket.send(JSON.stringify({
          resource: this.constructor.name
          , clientId: Sara.clientId
          , type: 'remove'
          , id: this.id
        }))
      }

      collection.remove(this)

      this.constructor.db.remove({ id: this.id }, function (err) { if (err) throw err })
    })
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
