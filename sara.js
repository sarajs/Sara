/*!
 *
 * UTILITIES
 *
 */

Function.prototype.method = function (name, method) {
  if (method) {
    this.prototype[name] = method
    return this
  }
  return this.prototype[name]
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
  var Local = typeof process === 'undefined' ? Sara.Client : Sara.Server

  // Defaults
  this.data = {}
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
  
  app.layout
  app.port = process.env.PORT || 1337
  app.root = path.dirname(module.parent.filename)
  
  // Create CRUD routes for resources
  for (var name in app.resources) {
    var Resource = app.resources[name]
      , partials = fs.readdirSync(app.root + '/views/' + name + 's/').filter(function (filename) { return filename.charAt(0) === '_' })
    
    for (var i = partials.length; i--;) {
      console.log(partials[i].trimExtension().substr(1))
      Handlebars.registerPartial(partials[i].trimExtension().substr(1), fs.readFileSync(app.root + '/views/' + name + 's/' + partials[i]).toString())
    }
    
    app.routes['/' + name + 's/' + 'new'] = { template: name + 's/new.html' } // CREATE
    app.routes['/' + name + 's/' + ':id'] = { context: Resource.find, template: name + 's/show.html' } // READ
    app.routes['/' + name + 's'] = { context: Resource.all, tempalte: name + 's/index.html' } // READ
    app.routes['/' + name + 's/' + ':id/' + 'edit'] = { context: Resource.find, template: name + 's/edit.html' } // UPDATE
    app.routes['/' + name + 's/' + ':id/' + 'delete'] = { context: Resource.find, template: name + 's/delete.html' } // DELETE
  }
  
  // Load the layout tempalte
  layout = fs.readFileSync(app.root + '/views/' + app.layout).toString()

  server = http.createServer(function (req, res) {
    // Try the route
    resource = app.routes[req.url]
    if (resource) {
      context = resource.context ? resource.context() : {}
      template = fs.readFileSync(app.root + '/views/' + resource.template).toString()
      
      // Load the presenter
      if (resource.context) yield = Handlebars.compile(template)(context)
      
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
  })
  
  server.listen(app.port)
  console.log('Sara is waiting for you on port ' + app.port + '.')
}

/*!
 *
 * RESOURCE
 *
 */

Sara.Resource = function Resource(object) {
  
}

Sara.Resource.all = function all() {
  return { posts: [{ id: 1, title: 'foo', content: 'wat' }, { id: 2, title: 'bar', content: 'wut' }] }
}

/*!
 *
 * VIEW
 *
 */

/*!
 *
 * PRESENTER
 *
 */

Sara.Presenter = function Presenter(object) {
  extend(this, object)
}
Sara.Presenter.extend = Sara.Resource.extend = function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
}

module.exports = Sara