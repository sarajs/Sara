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
    , _ = require('./utility')
  
  app.env = app.env || process.env.NODE_ENV
  app.port = process.env.PORT || 1337
  app.root = path.dirname(require.main.filename)
  
  // Load the layout template
  layout = fs.readFileSync(path.resolve(app.root, app.layout)).toString()

  Connect.createServer(function (req, res, next) { // Serve a route
  
    controller = app.route(req.url)
    
    next()
    
  }, function (req, res, next) { // Serve index.js
  
	  // Try index.js
    if (req.url === '/index.js') {
      return res.end(
      	'extend = ' + _.extend + '\n'
	    + Sara.toString() + '\n'
	    + 'Sara.Client = ' + Sara.Client.toString() + '\n'
	    + 'new Sara(' + JSON.stringify(app) + ')'
	    )
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
})