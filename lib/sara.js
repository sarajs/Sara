/*!
 *
 * SARA
 *
 * The application class, which in a traditional MVC sense would be the router.
 *
 */

// Modules
var _ = require('./sara/utils')
  , Options = require('./sara/options')
  , jsdom = require('jsdom').jsdom
  , path = require('path')

// Constants
global.IS_SERVER = !process.browser
global.IS_CLIENT = !!process.browser

/**
 *
 * The application class.
 * @constructor
 * @param {Object} - options - A hash of options to create your application by.
 * @returns {Object} A Sara instance.
 *
 */
var Sara = module.exports = (function Sara(options) {
  var View = require('./sara/view')
    , Model = require('./sara/model')

  // Defaults
  if (IS_SERVER) this.root = path.dirname(_.filepathFromStackIndex(2))
  this.port = process.env.PORT || 1337
  this.env = process.env.NODE_ENV
  this.cache = {}
  this._routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {}
  this.clients = {}
  this.View = View
  this.View.app = this
  this.Model = Model
  this.Model.app = this
  this.templates = {}
  this.dbstatus = {}
  this.paths = {}

  // Load options
  _(this).extend(options)

  // Load CLI arguments
  _(this).extend(new Options(process.argv))
})

// Modules
var Collection = require('./sara/collection')
  , Controller = require('./sara/controller')
  , Server = require('./sara/server')
  , Client = require('./sara/client')
  , Local = IS_SERVER ? Server : Client

// Include _.method and _.add
_.class(Sara)

/**
 * Extend the Sara class with an adapter
 * @param {Object} - adapter - a NodeJS module which exports View and Controller constructors.
 * @returns {Object} The Sara application class.
 *
 * FIXME: Adapters should be app-specific, not process-specific. This should really be a method.
 */
.add('adapter', function (adapter) {
  _(this).extend(adapter)
  return this
})

// Some other fun things
.add('Event', require('./sara/event'))
.add('Utils', _)
.method(function template(id, filepath, index) {
  var fs = require('fs')
    , path = require('path')

  if (IS_SERVER) {
    var resolved = path.resolve(path.dirname(_.filepathFromStackIndex(index || 2)), filepath)
      , contents = fs.readFileSync(resolved)

    return {
      content: contents
    , id: id
    , toString: function () {
        return this.content.toString()
      }
    }
  } else if (IS_CLIENT) {
    var script = document.querySelector('script[data-template=' + id + ']')
    return {
      content: script.textContent
    , id: id
    , toString: function () {
        return this.content.toString()
      }
    }
  }
})
.method(function layout(filepath) {
  if (IS_SERVER) {
    this.layout = this.template('layout', filepath, 3)
  }
  return this
})
.method('Collection', Collection)
.method('Controller', Controller)
.method(function routes(actions) {
  for (var route in actions) {
    this.get(route, actions[route])
    this.paths[route] = actions[route]
  }
})

/**
 * Add a string to the assets object.
 * @param {String} - route - A URL to access the asset by.
 * @param {String} - data - The text/plain content for the asset.
 *
 * FIXME: We don't really even need an assets object, this should be removed in favor of app.routes.GET.
 */
.method(function asset(route, data) {
  this.assets[route] = data
})

/**
 * Define GET, POST, PUT, and DELETE routes.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 */
.method('get', function (routes, action) {
  return this.createRoutes('GET', routes, action)
}).method('post', function (routes, action) {
  return this.createRoutes('POST', routes, action)
}).method('put', function (routes, action) {
  return this.createRoutes('PUT', routes, action)
}).method('delete', function (routes, action) {
  return this.createRoutes('DELETE', routes, action)
}).method('head', function (routes, action) {
  return this.createRoutes('HEAD', routes, action)
})

/**
 * An internal method for safely defining an array of routes
 * Used in the .[crud] methods which take strings or arrays
 * @param {method} - string - A method name.
 */
.method(function createRoutes(method, paths, action) {
  if (_.typeOf(paths) == 'string') paths = [paths]

  if (_.typeOf(paths) == 'array') {
    var that = this

    paths.forEach(function (path) {
      if (_.typeOf(path) !== 'string') fail()
      that._routes[method.toUpperCase()][path] = action
    })

    return this
  } else fail()

  function fail() {
    throw new Error("First argument of ." + method.toLowerCase() + "() must be a string or array of strings.")
  }
})

/**
 *
 * Start the router of a Sara instance.
 * Works as both app.init() and app.initialize()
 *
 */
.method(function initialize(fn) {
  setTimeout(function () {

    fn.bind(this)()
    this.local = new Local(this)

  }.bind(this))

  return this
})

/**
 * Retreive a route from a request object.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 *
 * FIXME: In the for loop it appears to call the route's action explicitly, seems wrong. Someone was high (it was me).
 *
 * FIXME: This method shouldn't take a request object, it should take a URL and a method. ;-)
 */
.method(function route(request) {
  var method = request.method.toUpperCase()
    , url = request.url

	if (this._routes[method][url]) return this._routes[method][url]

  for (var path in this._routes) {
    var match = url.match(new RegExp(path.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this._routes[method][path].call(this, match[1])
  }

  return null
})

/**
 * A shortcut to routing a get request
 * @param {String} - url - A URL to visit.
 */
.method(function visit(url) {
  return this.route({ method: 'GET', url: url })
})
