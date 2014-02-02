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
, 'changeAny': []
})

.method(function on(events, callback, context) {
  events = (events || '').split(' ')

  _(events).compact().forEach(function (event) {
    if (context) {
      callback.bind(context)
      callback._context = context
    }

    this._events[event] = this._events[event] || []
    this._events[event].push(callback)
  }.bind(this))
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

  models.forEach(function (model) {
    this.trigger('add')
    new CollectionEvent({
      model: model.constructor.name
    , event: 'add'
    , data: model
    }, model.constructor.app)
  }.bind(this))
})

.method(function remove(models) {
  var args = models instanceof Array ? models : [models]
  args.unshift(this)
  _.pull.apply(_, args)

  args.shift()
  args.forEach(function (model) {
    this.trigger('remove')
    new CollectionEvent({
      model: model
    , id: model.id
    }, model.constructor.app)
  }.bind(this))
})

.method(function trigger(event) {
  if (this._events[event].length) {
    _(this._events[event]).forEach(function (callback) {
      callback()
    })
  }
})

function CollectionEvent(object, app) {
  var copy = _.clone(object)
  console.log(copy)

  app.clients.forEach(function (client) {
    if (client.socketId) {
      client.socket.send(
        JSON.stringify({
          collectionEvent: copy
        })
      )
    }
  })
}