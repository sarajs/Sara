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
	, isNode = typeof global !== "undefined" && {}.toString.call(global) === '[object global]'

// Native extensions
with (_) {
	method.call(Function, method).method(add)
	Array.method(each).method(filter)
	String.method(trimExtension)
}

// Application
var Sara = module.exports = (function Sara(options) {

  var Local = isNode ? Sara.Server : Sara.Client

  // Defaults
  this.cache = {}
  this.routes = { 'GET': {}, 'POST': {}, 'PUT': {}, 'DELETE': {} }
  this.resources = {}
  this.history = {}
  
  // Load options
  _.extend.call(this, options)
  
  // Server
  new Local(this)

}).method('route', function (method, url) {

	if (this.routes[method][url]) return this.routes[method][url].call()

  for (var route in this.routes) {
    var match = url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[method][route].call(this, match[1])
  }
  
  return null

}).method('resource', function (Model) {
	
	// app/Model association
	Model._app = this
	this.resources[Model._name] = Model
	this.history[Model._name.toLowerCase() + 's'] = []
  
  return this

}).method('get', function (route, action) {

	this.routes['GET'][route] = action
	
	return this

}).method('post', function (route, action) {

	this.routes['POST'][route] = action

	return this

}).method('put', function (route, action) {

	this.routes['PUT'][route] = action

	return this

}).method('delete', function (route, action) {

	this.routes['DELETE'][route] = action

	return this	
	
})

Sara.Client = require('./sara/client')
Sara.Server = require('./sara/server')
Sara.Model = require('./sara/model')
Sara.HTML = require('./sara/html')
Sara.View = require('./sara/view')
Sara.Controller = require('./sara/controller')