// Modules
var _ = require('./sara/utility')

// Native extensions
with (_) {
	method.call(Function, method).method(add)
	Array.method(each).method(filter)
	String.method(trimExtension)
}

/*!
 *
 * SARA
 *
 * The application class.
 *
 */

var Sara = module.exports = (function Sara(options) {

  var Local = typeof window === 'undefined' ? Sara.Server : Sara.Client

  // Defaults
  this.cache = {}
  this.templating = null
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
  
  return false

}).method(function resource(Constructor) {

	var fs = require('fs')
		, path = require('path')
		, name = Constructor._name.toLowerCase()
		, Handlebars = require('handlebars')

  partials = fs.readdirSync(this.root + '/views/' + name + 's/').filter(function (filename) { return filename.charAt(0) === '_' })
  
  for (var i = partials.length; i--;) {
  	Handlebars.registerPartial(name + 's/' + partials[i].trimExtension().substr(1), fs.readFileSync(path.resolve(this.root, 'views', name + 's/' + partials[i])).toString())
  }
  
  this.routes['/' + name + 's/' + 'new'] = { template: name + 's/new.html' } // CREATE
  this.routes['/' + name + 's/' + ':id'] = { resource: Constructor, action: 'find', template: name + 's/show.html' } // READ
  this.routes['/' + name + 's'] = { resource: Constructor, action: 'all', template: name + 's/index.html' } // READ
  this.routes['/' + name + 's/' + ':id/' + 'edit'] = { resource: Constructor, action: 'find', template: name + 's/edit.html' } // UPDATE
  this.routes['/' + name + 's/' + ':id/' + 'delete'] = { resource: Constructor, action: 'find', template: name + 's/delete.html' } // DELETE
  
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