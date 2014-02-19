/*!
 *
 * SARA
 *
 * The application class, which in a traditional MVC sense would be the router.
 *
 */

// Constants
global.IS_SERVER = !process.browser
global.IS_CLIENT = !!process.browser

// Modules
var _ = require('./sara/utils')
  , jsdom = require('jsdom').jsdom
  , path = require('path')
  , View = require('./sara/view')
  , Model = require('./sara/model')
  , Event = require('./sara/event')
  , Collection = require('./sara/collection')
  , Controller = require('./sara/controller')
  , setupServer = require('./sara/server')
  , setupClient = require('./sara/client')

/**
 *
 * The application class.
 * @constructor
 * @param {Object} - options - A hash of options to create your application by.
 * @returns {Object} A Sara instance.
 *
 */
var Sara = module.exports = function Sara(options) {
  // Defaults
  if (IS_SERVER) this.root = path.dirname(_.filepathFromStackIndex(2))
  this.port = process.env.PORT || 1337
  this.env = process.env.NODE_ENV
  this.cache = {}
  this._routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'PATCH': {}, 'HEAD': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {}
  this.clients = {}
  this.View = View
  this.View.app = this
  this.Model = Model
  this.Model.app = this
  this.Event = Event
  this.Event.app = this
  this.templates = {}
  this.dbstatus = {}
  this.paths = {}
  this.ready = function () {
    if (!_.size(this.dbstatus)) return false
    return _.every(this.dbstatus)
  }

  // Load options
  _(this).extend(options)
}

// Some other fun things
Sara.Utils = _


/**
 * Extend the Sara class with an adapter
 * @param {Object} - adapter - a NodeJS module which exports View and Controller constructors.
 * @returns {Object} The Sara application class.
 *
 * FIXME: Adapters should be app-specific, not process-specific. This should really be a method.
 */
Sara.prototype.storage = function (adapter) {
  this.adapter = adapter
  return this
}

/**
 * Load a template and serve it for client-side rendering.
 * @param {String} - id - An id to reference the template by. FEMIX: none of this ever
 * @param {String} - filepath - Relative path to the template
 * @param {Number} - index - A private parameter to get the stack index via.
 */
Sara.prototype.template = function (id, filepath, index) {
  var fs = require('fs')
    , path = require('path')

  if (IS_SERVER) {
    var resolved = path.resolve(path.dirname(_.filepathFromStackIndex(index || 2)), filepath)
      , contents = fs.readFileSync(resolved)
    var templ = {
      content: contents
    , id: id
    , toString: function () {
        return this.content.toString()
      }
    }
    this.templates[id] = templ
    return templ
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
}

/**
 * Loads a template designed as the app's static layout.
 * @param {String} - filepath - Relative path to the layout file.
 */
Sara.prototype.layout = function (filepath) {
  if (IS_SERVER) {
    this.layout = this.template('layout', filepath, 3)
  }
  return this
}

Sara.prototype.Collection = Collection
Sara.prototype.Controller = Controller

/**
 * Define routes to serve on the client via history.pushstate
 */
Sara.prototype.routes = function (actions) {
  for (var route in actions) {
    this.get(route, actions[route])
    this.paths[route] = actions[route]
  }
}

/**
 * Define GET, POST, PUT, and DELETE routes.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 */
Sara.prototype.all = function (routes, action) {
  return this.get(routes, action)
  return this.post(routes, action)
  return this.put(routes, action)
  return this.patch(routes, action)
  return this.delete(routes, action)
  return this.head(routes, action)
}

Sara.prototype.get = function (routes, action) {
  return this.createRoutes('GET', routes, action)
}

Sara.prototype.post = function (routes, action) {
  return this.createRoutes('POST', routes, action)
}

Sara.prototype.put = function (routes, action) {
  return this.createRoutes('PUT', routes, action)
}

Sara.prototype.patch = function (routes, action) {
  return this.createRoutes('PATCH', routes, action)
}

Sara.prototype.delete = function (routes, action) {
  return this.createRoutes('DELETE', routes, action)
}

Sara.prototype.head = function (routes, action) {
  return this.createRoutes('HEAD', routes, action)
}

/**
 * An internal method for safely defining an array of routes
 * Used in the .[crud] methods which take strings or arrays
 * @param {method} - string - A method name.
 */
Sara.prototype.createRoutes = function (method, paths, action) {
  if (_.typeOf(paths) == 'string') paths = [paths]

  if (_.typeOf(paths) == 'array') {
    paths.forEach(function (path) {
      if (_.typeOf(path) !== 'string') fail()
      this._routes[method.toUpperCase()][path] = action
    }.bind(this))

    return this
  } else fail()

  function fail() {
    throw new Error("First argument of ." + method.toLowerCase() + "() must be a string or array of strings.")
  }
}

/**
 *
 * Start the router of a Sara instance.
 * Works as both app.init() and app.initialize()
 *
 */
Sara.prototype.initialize = function (fn) {
  setTimeout(function () {

    fn.bind(this)()
    if (IS_SERVER) setupServer(this)
    else setupClient(this)

  }.bind(this))

  return this
}

/**
 * Retreive a route from a request object.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 *
 * FIXME: In the for loop it appears to call the route's action explicitly, seems wrong. Someone was high (it was me).
 *
 * FIXME: This method shouldn't take a request object, it should take a URL and a method. ;-)
 */
Sara.prototype.route = function (request) {
  var method = request.method.toUpperCase()
    , url = request.url

	if (this._routes[method][url]) return this._routes[method][url]

  for (var path in this._routes) {
    var match = url.match(new RegExp(path.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this._routes[method][path].call(this, match[1])
  }

  return null
}

/**
 * A shortcut to routing a get request
 * @param {String} - url - A URL to visit.
 */
Sara.prototype.visit = function (url) {
  return this.route({ method: 'GET', url: url })
}
