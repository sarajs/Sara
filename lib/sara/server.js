/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the process object
 *
 */

module.exports = (function Server(app) { 
  var Connect = require('connect')
    , Sara = require('../sara')
  	, http = require('http')
    , fs = require('fs')
    , path = require('path')
    , _ = require('../utilities')
  
  app.env = app.env || process.env.NODE_ENV
  app.port = app.port || process.env.PORT || 1337
  app.root = path.dirname(require.main.filename)

	// Create the server
  Connect.createServer(function (req, res, next) { // Serve a route
  	
    var response = app.route(req.method, req.url)
    
    if (response) res.end(response)
    else next()
    
  }, function (req, res, next) { // Serve index.js
  
	  // Try index.js
    if (req.url === '/index.js') {
      res.end(
      	'extend = ' + _.extend + '\n'
	    + Sara.toString() + '\n'
	    + 'Sara.Client = ' + Sara.Client.toString() + '\n'
	    + 'new Sara(' + JSON.stringify(app) + ')'
	    )
    } else next()
    
  }, function (req, res, next) { // Serve another asset
    
    var asset = path.join(app.root, 'assets', req.url)
    
    if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) res.end(fs.readFileSync(asset))
    else next()
    
  }, function (req, res, next) {
  
	  res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    res.end()
    
  }).listen(app.port) // Start the server
  
  console.log('Listening on port ' + app.port + '.')
})