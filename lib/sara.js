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
  , Client = require('./sara/client')

// Constants
var IS_NODE = typeof global !== "undefined" && {}.toString.call(global) === '[object global]'

// Native extensions

_.method.call(Function,_. method).method(_.add)
Array.method(_.each).method(_.filter)
String.method(_.trimExtension)
String.method(_.pluralize)

// The application constructor
var Sara = module.exports = (function SaraConstructor(options) {
  var Local = IS_NODE ? Sara.Server : Sara.Client

  // Defaults
  this.cache = {}
  this.routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  this.processors = {}
  this.assets = {
    '/index.js': {
      'SaraClient': Client
    }
  }
  
  // Load options
  _.extend.call(this, options)
  
  // Server
  new Local(this)
})

// Associates a resource with an application
Sara.method('resource', function (Model) {
	// app/Model association
	Model.app = this
	this.resources[Model._name] = Model
	
	// Create history array
	this.history[Model._name.pluralize()] = []
  
  // Return the app for chaining
  return this
})

// Methods for creating dynamic assets
Sara.method('asset', function (route, data) {
  this.assets[route] = data
}).method('compile', function (component, logic) {
  this.assets['/index.js'][component] = logic.toString()
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
Sara.method('route', function (method, url) {
  method = method.toUpperCase()

	if (this.routes[method][url]) return this.routes[method][url].call()

  for (var route in this.routes) {
    var match = url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[method][route].call(this, match[1])
  }
  
  return null
}).method('visit', function (url) {
  this.route('GET', url)
})

// Postprocessing
Sara.method('use', function (format, method) {
  this.processors[format] = method
})

// Sara's classes
var Client      = Sara.Client      = require('./sara/client')
var Server      = Sara.Server      = require('./sara/server')
var Model       = Sara.Model       = require('./sara/model')
var Controller  = Sara.Controller  = require('./sara/controller')

// Helpers
Sara.add('bind', function (name, array) {
  if (array) {
    var bindingList = {}
    bindingList[name] = array
    return { _bindingList: bindingList }
  }
  return { _binding: name }
})