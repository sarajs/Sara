/*!
 *
 * UTILITIES
 *
 */

Function.prototype.method = function (object) {
  if (object instanceof Function) {
    this.prototype[object.name] = object
    return this
  }
  return this.prototype[object]
}

Array.prototype.each = function(iterator, context) {
  for (var i = 0, length = this.length; i < length; i++) {
    if (iterator.call(context, this[i], i, this) === {}) return
  }
}

Array.prototype.filter = function(iterator, context) {
  var results = []
  if (this == null) return results
  this.each(function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value)
  })
  return results
}

function extend(target, object) {
  for (var prop in object) {
    target[prop] = object[prop]
  }
  return target
}

String.prototype.trimExtension = function () {
  return this.replace(/\.[^/.]+$/, '')
}

/*!
 *
 * SARA
 *
 */

function Sara(options) {
  // Singleton goodness
  if (arguments.callee._instance) return arguments.callee._instance
  arguments.callee._instance = this

  var Local = typeof process === 'undefined' ? Sara.Client : Sara.Server

  // Defaults
  this.cache = {}
  this.templating = null
  this.websockets = null
  this.layout = 'layout.html'
  this.resources = {}
  this.routes = {}
  
  // Load options
  extend(this, options)
  
  // Server
  new Local(this)
}

/*!
 *
 * CLIENT
 * This code must rely only the window object
 *
 */

Sara.Client = function Client(object) {
  console.log("new client")
}

/*!
 *
 * SERVER
 * This code must rely only the process object
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
  layout = fs.readFileSync(app.root + '/views/' + app.layout).toString()

  server = http.createServer(function (req, res) {
    routeObject = app.routes[req.url] || matchRoute()
    
    if (routeObject) {
      context = routeObject.resource ? routeObject.resource[routeObject.action](routeObject.variables) : {}
      template = fs.readFileSync(app.root + '/views/' + routeObject.template).toString()
      
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
    asset = app.root + '/assets' + req.url
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) res.end(fs.readFileSync(asset))
    
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    res.end()
    
    function matchRoute() {
      for (var route in app.routes) {
        var match = req.url.match(new RegExp(route.replace(/:[^\s\/]+/g, '(.+)')))
        if (match && req.url === match[0]) {
          return {
            resource: app.routes[route].resource
          , action: app.routes[route].action
          , template: app.routes[route].template
          , variables: {
              id: match[1]
            }
          }
        }
      }
      
      return false
    }
  })
  
  server.listen(app.port)
  console.log('Sara is waiting for you on port ' + app.port + '.')
}

Sara.method(function routes(Resource) {
    partials = fs.readdirSync(this.root + '/views/' + name + 's/').filter(function (filename) { return filename.charAt(0) === '_' })
    
    for (var i = partials.length; i--;) Handlebars.registerPartial(name + 's/' + partials[i].trimExtension().substr(1), fs.readFileSync(this.root + '/views/' + name + 's/' + partials[i]).toString())
    
    this.routes['/' + name + 's/' + 'new'] = { template: name + 's/new.html' } // CREATE
    this.routes['/' + name + 's/' + ':id'] = { resource: Resource, action: 'find', template: name + 's/show.html' } // READ
    this.routes['/' + name + 's'] = { resource: Resource, action: 'all', template: name + 's/index.html' } // READ
    this.routes['/' + name + 's/' + ':id/' + 'edit'] = { resource: Resource, action: 'find', template: name + 's/edit.html' } // UPDATE
    this.routes['/' + name + 's/' + ':id/' + 'delete'] = { resource: Resource, action: 'find', template: name + 's/delete.html' } // DELETE
})

/*!
 *
 * RESOURCE
 *
 */

Sara.Resource = function Resource(object) {
}

Sara.Resource.all = function all() {
  console.log(this)
  return { posts: [{ id: 1, title: 'foo', content: 'wat' }, { id: 2, title: 'bar', content: 'wut' }] }
}

Sara.Resource.find = function find(id) {
  console.log(this)
  return { id: 1, title: 'foo', content: 'wat' }
}

Sara.Resource.extend = function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
}

module.exports = Sara