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
  var that = this
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , layout
    , port
    , server
    , yield
    , route

  // Defaults
  this.root = path.dirname(module.parent.filename)
  this.data = {}
  this.env = process.env.NODE_ENV || 'development'
  this.templates = null
  this.websockets = null
  this.layout = 'layout.html'
  
  // Load options
  this.extend(options)
  
  // Load the layout tempalte
  layout = fs.readFileSync(this.root + '/templates/' + this.layout).toString()
  
  // Port 80 in production
  if (this.env === 'production') port = 80
  else {
    port = 1337
    process.app = this
  }
  
  // Server
  server = http.createServer(function (req, res) {
    route = that.routes[req.url]
    
    if (route) { // If the route exists
      // Load the presenter
      if (route instanceof Function) yield = new route()
      else yield = route
      
      // Add the script
      yield += '\n<script src="/index.js"></script>'
      
      // {{{}}} shortcut
      yield = new that.templates.SafeString(yield)
    } else yield = '404 not found' // Or 404
  
    res.end(that.templates.compile(layout)({ yield: yield }))
  })
  
  server.listen(port)
  console.log('Sara is waiting for you on port ' + port + '.')
}

/*!
 *
 * CLIENT
 *
 */

Sara.Client = function Client(object) {
  
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

Sara.Presenter = function Presenter() {
  
}

module.exports = Sara