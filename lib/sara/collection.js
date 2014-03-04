/*!
 *
 * COLLECTION
 * A tiny collection class.
 *
 */

// Modules
var _ = require('./utils')

// Constants
var IS_SERVER = !process.browser
  , IS_CLIENT = !!process.browser

var Collection = module.exports = function Collection(array) {
  array = array || []
  if (!(array instanceof Array)) throw new Error('Collections only take arrays.')
  return _.extend(array, this.constructor.prototype)
}

Collection.prototype._events = {
  'add': []
, 'remove': []
, 'changeAny': []
}

Collection.prototype.on = function (events, callback, context) {
  events = (events || '').split(' ')

  _(events).compact().forEach(function (event) {
    if (context) {
      callback.bind(context)
      callback._context = context
    }

    this._events[event] = this._events[event] || []
    this._events[event].push(callback)
  }.bind(this))
}

Collection.prototype.off = function (events, callback, context) {
  events = _.typeOf(events) === 'string' ? events.split(' ') : null

  _(this._events).forIn(function (callbacks, event) {
    if (events === null || ~events.indexOf(event)) {
      _(callbacks).forEach(function (boundCallback) {
        if (boundCallback === callback || boundCallback._context == context) _(callbacks).pull(boundCallback)
      })
    }
  })
}

Collection.prototype.add = function (models) {
  models = models instanceof Array ? models : [models]
  this.push.apply(this, models)

  models.forEach(function (model) {
    this.trigger('add')
  }.bind(this))
}

/**
 * Get all the records in memory as a JSON string.
 * @returns {String}
 */
Collection.prototype.toJSON = function () {
  return JSON.stringify(this.data())
}


Collection.prototype.data = function () {
  var collection = []

  this.forEach(function (record) {
    collection.push(record.data())
  })

  return collection
}

Collection.prototype.remove = function (models) {
  var args = models instanceof Array ? models : [models]
  args.unshift(this)
  _.pull.apply(_, args)

  args.shift()
  args.forEach(function (model) {
    this.trigger('remove')
  }.bind(this))
}

Collection.prototype.trigger = function (event) {
  if (this._events[event].length && IS_CLIENT) {
    _(this._events[event]).forEach(function (callback) {
      callback()
    })
  }
}
