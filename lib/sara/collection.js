/*!
 *
 * COLLECTION
 * A tiny collection class.
 *
 */

var _ = require('./utils')

var Collection = module.exports = _.class(function Collection(array) {
  array = array || []
  if (!(array instanceof Array)) throw new Error('Collections only take arrays.')
  return _.extend(array, this.constructor.prototype)
})

.method('_events', {
  'add': []
, 'remove': []
, 'sort': []
, 'reset': []
})

.method(function on(events, callback, context) {
  events = (events || '').split(' ')

  var that = this

  _(events).compact().forEach(function (event) {
    if (context) {
      callback.bind(context)
      callback._context = context
    }

    that._events[event].push(callback)
  })
})

.method(function off(events, callback, context) {
  events = (events || '').split(' ')

  _(this._events).forIn(function (callbacks, event) {
    if (~events.indexOf(event)) {
      _(callbacks).forEach(function (boundCallback) {
        if (boundCallback === callback || boundCallback._context == context) _(callbacks).pull(boundCallback)
      })
    }
  })
})

.method(function add(models) {
  models = models instanceof Array ? models : [models]
  this.push.apply(this, models)
  this.trigger('add')
})

.method(function remove(models) {
  args = models instanceof Array ? models : [models]
  args.unshift(this)
  _.pull.apply(_, args)
  this.trigger('remove')
})

.method(function trigger(event) {
  if (this._events.remove.length) {
    _(this._events.remove).forEach(function (callback) {
      callback()
    })
  }
})