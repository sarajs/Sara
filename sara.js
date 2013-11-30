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

Object.prototype.extend = function (object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
}

/*!
 *
 * SARA
 *
 */

function Sara(options) {
  var Local = process ? Sara.Server : Sara.Client

  // Defaults
  this.data = {}
  this.env = process.env.NODE_ENV || 'development'
  this.templates = null
  this.websockets = null
  this.layout = 'layout.html'
  this.resources = {}
  this.routes = {}
  this.port = process.env.PORT || 80
  
  // Load options
  this.extend(options)
  
  
  
  // Port 80 in production
  if (this.env !== 'production') this.port = 1337
  
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
    , layout
    , Presenter
    , asset
    , yield
    , server
  
  app.root = path.dirname(module.parent.filename)
  
  // Load resources
  var resourceConstructors = fs.readdirSync(app.root + '/resources')
    , i = resourceConstructors.length
  while (resourceConstructors--) {
    console.log(resourceConstructors[i])
  }
  
  // Load the layout tempalte
  layout = fs.readFileSync(app.root + '/templates/' + app.layout).toString()

  server = http.createServer(function (req, res) {
    Presenter = app.routes[req.url]
  
    if (req.url === '/index.js') res.end('new ' + Sara.Client.toString())
    
    asset = app.root + '/assets' + req.url
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) res.end(fs.readFileSync(asset))
    
    if (Presenter) { // if it's looking for a route
        // Load the presenter
        if (Presenter instanceof Function) yield = new Presenter()
        else yield = Presenter
        
        // Add the script
        yield += '\n<script src="/index.js"></script>'
                
        // {{{}}} shortcut
        yield = new app.templates.SafeString(yield)
    
      res.end(app.templates.compile(layout)({ yield: yield }))
    }
    
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

/*!
 *
 * VIEW
 *
 */

Sara.View = function View(object) {
  
}

/*!
 *
 * PRESENTER
 *
 */

Sara.Presenter = function Presenter(object) {
  return object.content
}

module.exports = Sara