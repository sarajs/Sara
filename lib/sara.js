/*!
 *
 * SARA
 *
 * The application class.
 *
 */

// Modules
var _ = require('./sara/utility')
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
  
  // Load options
  _.extend.call(this, options)
  
  // Server
  new Local(this)

}).method(function route(url) {

	if (this.routes[url]) return this.routes[url].call()

  for (var route in this.routes) {
    var match = url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return this.routes[route].call(this, match[1])
  }
  
  return null

}).method(function resource(Model) {

	// app/Model association
	Model._app = this
	this.resources[Model._name] = Model
  
  return this

}).method(function get(route, action) {

	this.routes['GET'][route] = action
	
	return this

}).method(function post(route, action) {

	this.routes['POST'][route] = action

	return this

}).method(function put(route, action) {

	this.routes['PUT'][route] = action

	return this

}).method(function delete(route, action) {

	this.routes['DELETE'][route] = action

	return this	
	
})

Sara.Client = require('./sara/client')
Sara.Server = require('./sara/server')
Sara.Resource = require('./sara/resource')