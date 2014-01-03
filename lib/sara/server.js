/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the NodeJS host objects.
 *
 */

var Connect = require('connect')
  , Sara = require('../sara')
  , browserify = require('browserify')
  , Model = require('./model')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , _ = require('../utilities')

Sara.template = function (filename) {
  return fs.readFileSync(path.join(path.dirname(require.main.filename), filename))
}

var Server = module.exports = (function ServerConstructor(app) { 
  
  app.env = app.env || process.env.NODE_ENV
  app.port = app.port || process.env.PORT || 1337
  app.root = path.dirname(require.main.filename)
  
  app.bundle = browserify()
  app.bundle.ignore('./sara/server') // Prevent sara/server form loading
  app.bundle.add(path.join(__dirname, '../sara')) // Compile Sara
  app.bundle.add(require.main.filename) // Compile the app
  
  // Compile the bundle and give it an asset route
  app.bundle.bundle(function (err, src) {
    if (err) throw err
    app.assets['/index.js'] = src
  })
  
  // Create the server
  Connect.createServer(function (req, res, next) { // Serve a route
    
    var action = app.route(req)    
    if (action) action(req, res)
    else next()
    
  }, function (req, res, next) { // Serve dynamic asset
  
    if (app.assets[req.url]) {
      res.writeHead(200)
      res.end(app.assets[req.url])
    } else next()
    
  }, function (req, res, next) { // Serve static asset
  
     asset = path.join(app.root, 'assets', req.url)
     if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) {
       
       asset = fs.readFileSync(asset).toString()  
       res.writeHead(200)
       res.end(asset)
     
     } else next()
  
  }, function (req, res, next) { // Serve 404 error
  
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("404 Not found")
    res.end()
    
  }).listen(app.port) // Start the server
  
  console.log('Listening on port ' + app.port + '.')
})