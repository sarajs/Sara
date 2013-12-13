/*!
 *
 * NATIVE EXTENSIONS
 *
 * Extension defenitions are under UTILITIES.
 *
 */

method.call(Function, method).method(add)
Array.method(each).method(filter)
String.method(trimExtension)

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
  extend.call(this, options)
  
  // Server
  new Local(this)

}).method(function getRoute(url) {

	if (this.routes[req.url]) return this.routes[req.url]

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
		, name = Constructor.name.toLowerCase()

  partials = fs.readdirSync(this.root + '/views/' + name + 's/').filter(function (filename) { return filename.charAt(0) === '_' })
  
  for (var i = partials.length; i--;) Handlebars.registerPartial(name + 's/' + partials[i].trimExtension().substr(1), fs.readFileSync(path.resolve(this.root, 'views', name + 's/' + partials[i]).toString()))
  
  this.routes['/' + name + 's/' + 'new'] = { template: name + 's/new.html' } // CREATE
  this.routes['/' + name + 's/' + ':id'] = { resource: Constructor, action: 'find', template: name + 's/show.html' } // READ
  this.routes['/' + name + 's'] = { resource: Constructor, action: 'all', template: name + 's/index.html' } // READ
  this.routes['/' + name + 's/' + ':id/' + 'edit'] = { resource: Constructor, action: 'find', template: name + 's/edit.html' } // UPDATE
  this.routes['/' + name + 's/' + ':id/' + 'delete'] = { resource: Constructor, action: 'find', template: name + 's/delete.html' } // DELETE
})

/*!
 *
 * CLIENT
 *
 * This code must rely only on native objects and the window object
 *
 */

Sara.Client = function Client(app) {
  console.log("new client")
}

/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the process object
 *
 */

Sara.Server = function Server(app) {
  var http = require('http')
    , fs = require('fs')
    , path = require('path')
    , Handlebars = require('handlebars')
    , layout
    , presenter
    , asset
    , yield
    , server
    , context
  
  app.env = app.env || process.env.NODE_ENV
  app.port = process.env.PORT || 1337
  app.root = path.dirname(module.parent.filename)
  
  // Load the layout tempalte
  layout = fs.readFileSync(path.resolve(app.root, app.layout)).toString()

  server = http.createServer(function (req, res) {
    routeObject = app.getRoute(req.url)
    
    if (routeObject) {
      context = routeObject.resource ? routeObject.resource[routeObject.action](routeObject.variables) : {}
      template = fs.readFileSync(path.resolve(app.root, routeObject.template)).toString()
      
      // Load the presenter
      yield = Handlebars.compile(template)(context)
      
      // Add the script
      yield += '\n<script src="/index.js"></script>'
  
      res.end(Handlebars.compile(layout)({ yield: new Handlebars.SafeString(yield) }))
    }
    
    // Try index.js
    if (req.url === '/index.js') {
      res.end('extend = ' + extend + '\n'
      + Sara.toString() + '\n'
      + 'Sara.Client = ' + Sara.Client.toString() + '\n'
      + 'new Sara(' + JSON.stringify(app) + ')') 
    }
    
    // Try an asset
    asset = path.resolve(app.root, 'assets', req.url)
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) return res.end(fs.readFileSync(asset))
    
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    return res.end()
  })
  
  server.listen(app.port)
  console.log('Sara is waiting for you on port ' + app.port + '.')
}

/*!
 *
 * RESOURCE
 *
 * A class meant to be extended by the framework user for creating resources.
 *
 */

Sara.Resource = (function Resource(object) {
}).add(function all() {
  return { posts: [{ id: 1, title: 'foo', content: 'wat' }, { id: 2, title: 'bar', content: 'wut' }] }
}).add(function find(id) {
  return { id: 1, title: 'foo', content: 'wat' }
}).add(extend)

/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

// Add a function as a property of an object
function add(func) {
	this[func.name] = func
	return this
}

// Copy all of the properties in the source objects over to the destination object
function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
}

// Filters an objects keys by an iterator function
function filter(iterator, context) {
  var results = []
  if (this == null) return results
  this.each(function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value)
  })
  return results
}

// Iterates over an objects keys
function each(iterator, context) {
  for (var i = 0, length = this.length; i < length; i++) {
    if (iterator.call(context, this[i], i, this) === {}) return
  }
}

// A prototyping helper
function method(method) {
  if (method instanceof Function) {
    if (method.name) {
      this.prototype[method.name] = method
      return this
    }
    throw 'Attempted to prototype anonymous function to ' + this
  }
  return this.prototype[method]
}

// Removes the extension from a file
function trimExtension() {
  return this.replace(/\.[^/.]+$/, '')
}