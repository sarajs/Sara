/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the process object
 *
 */

module.exports = function Server(app) { 
  var Connect = require('connect')
  	, http = require('http')
    , fs = require('fs')
    , path = require('path')
    , Handlebars = require('handlebars')
    , _ = require('./utility')
    , Sara = require('../sara')
    , layout
    , presenter
    , asset
    , yield
    , server
    , context
  
  app.env = app.env || process.env.NODE_ENV
  app.port = process.env.PORT || 1337
  app.root = path.dirname(require.main.filename)
  
  // Load the layout template
  layout = fs.readFileSync(path.resolve(app.root, app.layout)).toString()

  Connect.createServer(function (req, res, next) { // Serve a route
  
    routeObject = app.route(req.url)
    
    if (routeObject) {
      context = routeObject.resource ? routeObject.resource[routeObject.action](routeObject.variables) : {}
      if (req.method === 'GET') {
	      template = fs.readFileSync(path.resolve(app.root, 'views', routeObject.template)).toString()
	      
	      // Load the presenter
	      yield = Handlebars.compile(template)(context)
	      
	      // Add the script
	      yield += '\n<script src="/index.js"></script>'
	      
	      res.end(Handlebars.compile(layout)({ yield: new Handlebars.SafeString(yield) }))
	      return
      } else if (req.method === 'POST') {
      	req.on('data', function (data) {
      		console.log(data.toString())
		      app.cache[routeObject.resource._name + 's'].push(new routeObject.resource(data))
		      console.log(app.cache[routeObject.resource._name + 's'])
      	})
      	return
      }
    }
    
    next()
    
  }, function (req, res, next) { // Serve index.js
  
	  // Try index.js
    if (req.url === '/index.js') {
      res.end(
      	'extend = ' + _.extend + '\n'
	    + Sara.toString() + '\n'
	    + 'Sara.Client = ' + Sara.Client.toString() + '\n'
	    + 'new Sara(' + JSON.stringify(app) + ')'
	    )
	    
	    return
    }
    
    next()
    
  }, function (req, res, next) { // Serve another asset
    
    // Try an asset
    asset = path.join(app.root, 'assets', req.url)
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) return res.end(fs.readFileSync(asset))
    else next()
    
  }, function (req, res, next) {
  
	  res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    return res.end()
    
  }).listen(app.port) // Start the server
  
  console.log('Listening on port ' + app.port + '.')
}
