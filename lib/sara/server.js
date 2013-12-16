/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the process object
 *
 */

module.exports = function Server(app) {
  var http = require('http')
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

  server = http.createServer(function (req, res) {
    routeObject = app.route(req.url)
    
    if (routeObject) {
      context = routeObject.resource ? routeObject.resource[routeObject.action](routeObject.variables) : {}
      if (req.method === 'GET') {
	      template = fs.readFileSync(path.resolve(app.root, 'views', routeObject.template)).toString()
	      
	      // Load the presenter
	      yield = Handlebars.compile(template)(context)
	      
	      // Add the script
	      yield += '\n<script src="/index.js"></script>'
	      
	      return res.end(Handlebars.compile(layout)({ yield: new Handlebars.SafeString(yield) }))
      } else if (req.method === 'POST') {
      	req.on('data', function(data) {
      		console.log(data.toString())
		      app.cache[routeObject.resource._name + 's'].push(new routeObject.resource(data))
		      console.log(app.cache[routeObject.resource._name + 's'])
      	})
      }
    }
    
    // Try index.js
    if (req.url === '/index.js') {
      return res.end(
      	'extend = ' + _.extend + '\n'
	    + Sara.toString() + '\n'
	    + 'Sara.Client = ' + Sara.Client.toString() + '\n'
	    + 'new Sara(' + JSON.stringify(app) + ')'
	    ) 
    }
    
    // Try an asset
    asset = path.join(app.root, 'assets', req.url)
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) return res.end(fs.readFileSync(asset))
    
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    return res.end()
  })
  
  server.listen(app.port)
  console.log('Sara is waiting for you on port ' + app.port + '.')
}
