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
  this.routes = {}
  
  // Load options
  _.extend.call(this, options)
  
  // Server
  new Local(this)

}).method(function route(url) {

	if (this.routes[url]) return this.routes[url]

  for (var path in this.routes) {
    var match = url.match(new RegExp(path.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) return true
  }
  
  return null

}).method(function resource(Model) {

	// app/Model association
	Model._app = this
	this.resources[Model._name] = Model

	this.get()
	this.post()
	this.put()
	this.del()
  
  return this

}).method(function get(path, route) {

	this.routes[path] = route
	
	return this

}).method(function post(path, route) {

	this.routes[path] = route

	return this

}).method(function put(path, route) {

	this.routes[path] = route

	return this

}).method(function del(path, route) {

	this.routes[path] = route

	return this	
	
})

Sara.Client = require('./sara/client')
Sara.Server = require('./sara/server')
Sara.Resource = require('./sara/resource')