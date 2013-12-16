/*!
 *
 * SARA
 *
 * The application class.
 *
 */

// Modules
var _ = require('./sara/utility')

// Native extensions
with (_) {
	method.call(Function, method).method(add)
	Array.method(each).method(filter)
	String.method(trimExtension)
}

// Application
var Sara = module.exports = (function Sara(options) {

  var Local = typeof window === 'undefined' ? Sara.Server : Sara.Client

  // Defaults
  this.cache = {}
  this.websockets = null
  this.layout = 'views/layout.html'
  this.resources = {}
  this.routes = {}
  
  // Load options
  _.extend.call(this, options)
  
  // Server
  new Local(this)

}).method(function route(url) {

	if (this.routes[url]) return this.routes[url]

  for (var path in this.routes) {
    var match = url.match(new RegExp(path.replace(/:[^\s\/]+/g, '(.+)')))
    if (match && url === match[0]) {
      return {
        resource: this.routes[path].resource
      , action: this.routes[path].action
      , template: this.routes[path].template
      , variables: {
          id: match[1]
        }
      }
    }
  }
  
  return null

}).method(function resource(Constructor) {

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