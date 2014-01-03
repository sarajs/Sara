/*!
 *
 * SARA
 *
 * The application class, which in a traditional MVC sense would be the router.
 * This code must rely only on native objects, and on properties common between the window object and the process object.
 *
 */

// Modules
var _ = require('./utilities')

// Constants
var isNode = !process.browser

// The application constructor
var Sara = module.exports = (function SaraConstructor(options) {
  // Defaults
  this.cache = {}
  this.routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {}
  
  // Load options
  _(this).extend(options)
  
  // Server
  this.local = isNode ? new Server(this) : new Client(this)
})

// Sara's classes
var Model = Sara.Model = require('./sara/model')
if (isNode) var Server = Sara.Server = require('./sara/server')
else var Client = Sara.Client = require('./sara/client')

Sara.method = _.method

// Associates a resource with an application
Sara.method('resource', function (Model) {
	// app/Model association
	Model.app = this
	this.resources[Model._name] = Model
	
	// Create history array
	this.history[_(Model._name).pluralize()] = []
  
  // Return the app for chaining
  return this
})

// Methods for creating dynamic assets
Sara.method('asset', function (route, data) {
  this.assets[route] = data
})

// Methods for creating routes
Sara.method('get', function (route, action) {
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

// Methods for making internal requests with Sara
Sara.method('route', function (request) {
  var method = request.method.toUpperCase()
    , url = request.url

	if (this.routes[method][url]) return this.routes[method][url]

  for (var route in this.routes) {
    var match = url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[method][route](match[1])
  }
  
  return null
}).method('visit', function (url) {
  this.route('GET', url)
})