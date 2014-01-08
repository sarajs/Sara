/*!
 *
 * SARA
 *
 * The application class, which in a traditional MVC sense would be the router.
 *
 */

var _ = require('./sara/utils')
  , optimist = require('optimist')

// Constants
var ISNODE = !process.browser
  , argv = optimist.argv

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
  this.env = argv.env || argv.environment || process.env.NODE_ENV
  this.cache = {}
  this.routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {}
  this.local = new Local(this)

  // Load options
  _(this).extend(options)
})

// Modules
var Model = require('./sara/model')
  , Server = require('./sara/server')
  , Local = ISNODE ? Server : Object

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
.add('ISNODE', ISNODE)
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
.method('get', function (route, action) {
	this.routes.GET[route] = action
	return this
}).method('post', function (route, action) {
	this.routes.POST[route] = action
	return this
}).method('put', function (route, action) {
	this.routes.PUT[route] = action
	return this
}).method('delete', function (route, action) {
	this.routes.DELETE[route] = action
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

  for (var route in this.routes) {
    var match = url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[method][route].call(this, match[1])
  }

  return null
})

/**
 * A shortcut to routing a get request
 * @param {String} - url - A URL to visit.
 */
.method(function visit(url) {
  this.route('GET', url).call()
})
