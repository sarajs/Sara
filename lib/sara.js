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

// Constants
var IS_NODE = !process.browser

/**
 *
 * The application class.
 * @constructor
 * @param {Object} - options - A hash of options to create your application by.
 * @returns {Object} A Sara instance.
 *
 */
var Sara = module.exports = (function SaraConstructor(options) {
  // Defaults
  this.port = process.env.PORT || 1337
  this.env = process.env.NODE_ENV
  this.cache = {}
  this.routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {}
  this.local = new Local(this)

  // Load options
  _(this).extend(options)
  // Load CLI arguments
  _(this).extend(new Options(process.argv))
})

// Modules
var Model = require('./sara/model')
  , Server = require('./sara/server')
  , Client = require('./sara/client')
  , Local = IS_NODE ? Server : Client

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
.add('extend', _.extend)
.add('IS_NODE', IS_NODE)
.add('Model', Model)
.add('Utils', _)

/**
  * @stub
 */
.method(function assets(path) {
  // fs.readDirSync(path.join(app.root, path)
})

/**
 *
 * Create an association between a model and an app for writing to disk.
 * @param {Object} - adapter - a NodeJS module which exports View and Controller constructors.
 * @returns {Object} The Sara application class.
 *
 * FIXME: This shouldn't be called 'resource', that will be for creating all CRUD routes at once like in Rails.
 *
 * FIXME: Should this even be necessary? It's hacky AF.
 *
 */
.method(function stores(Model) {
	// app/Model association
	Model.app = this
	this.resources[Model._name] = Model

	// Create history array
	this.history[_(Model._name).pluralize()] = []

  // Return the app for chaining
  return this
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
  if (_.typeOf(routes) == 'string') routes = [routes]

  var that = this

  routes.forEach(function (route) {
    that.routes.GET[route] = action
  })

	return this
}).method('post', function (routes, action) {
  if (_.typeOf(routes) == 'string') routes = [routes]

  var that = this

  routes.forEach(function (route) {
    that.routes.POST[route] = action
  })

	return this
}).method('put', function (routes, action) {
  if (_.typeOf(routes) == 'string') routes = [routes]

  var that = this

  routes.forEach(function (route) {
    that.routes.PUT[route] = action
  })

	return this
}).method('delete', function (routes, action) {
  if (_.typeOf(routes) == 'string') routes = [routes]

  var that = this

  routes.forEach(function (route) {
    that.routes.DELETE[route] = action
  })

	return this
}).method('head', function (routes, action) {
  if (_.typeOf(routes) == 'string') routes = [routes]

  var that = this

  routes.forEach(function (route) {
    that.routes.HEAD[route] = action
  })

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

	if (this.routes[method][url]) return this.routes[method][url]

  for (var path in this.routes) {
    var match = url.match(new RegExp(path.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[method][path].call(this, match[1])
  }

  return null
})

/**
 * A shortcut to routing a get request
 * @param {String} - url - A URL to visit.
 */
.method(function visit(url) {
  this.route({ method: 'GET', url: url }).call()
})
