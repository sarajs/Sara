/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the NodeJS 'process' object.
 *
 */

var Server = module.exports = (function ServerConstructor(app) { 
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
    
  }, function (req, res, next) { // Serve dynamic asset
    var asset = ''

    if (app.assets[req.url]) {
      if (_.typeOf(app.assets[req.url]) === 'string') asset = app.assets[req.url]
      else {
        for (var key in app.assets[req.url]) {
          asset += app.assets[req.url][key].toString()
        }
      }
    
      if (app.processors[_.grabExtension.call(req.url)]) asset = app.processors[asset].call(process, asset)
    
      res.end(asset)
    } else next()
    
  }, function (req, res, next) { // Serve static asset
  
     asset = path.join(app.root, 'assets', req.url)
     if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) {
       asset = fs.readFileSync(asset).toString()
       if (app.processors[_.grabExtension.call(req.url)]) asset = app.processors[_.grabExtension.call(req.url)](asset)
       res.end(asset)
     }
  
  }, function (req, res, next) { // Serve 404 error
  
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    res.end()
    
  }).listen(app.port) // Start the server
  
  console.log('Listening on port ' + app.port + '.')
})