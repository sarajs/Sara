/*!
 *
 * SERVER
 *
 * This code must rely only on native objects and the NodeJS host objects.
 *
 */

// Modules
var Connect = require('connect')
  , Sara = require('../sara')
  , browserify = require('browserify')
  , Model = require('./model')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , _ = require('./utils')
  , jsdom = require('jsdom').jsdom

// JSDOM
var document = jsdom()
_(global).extend(document.parentWindow)

/**
 *
 * A server constructor?
 * @constructor
 * @param {Object} - app - A Sara instance.
 * @returns {undefined} ???????
 *
 * FIXME: Why the fuck is this a constructor?
 *
 */
var Server = module.exports = (function ServerConstructor(app) {

  // FIXME: Fuck all this code here.
  app.root = path.dirname(require.main.filename)
  app.bundle = browserify()
  app.bundle.ignore('./sara/server') // Prevent sara/server form loading
  app.bundle.add(path.join(__dirname, '../sara')) // Compile Sara
  app.bundle.add(require.main.filename) // Compile the app
  _(Sara.adapters).each(function (id) { app.bundle.add(id) }) // oooohhhhh...
  
  // Compile the bundle and give it an asset route
  app.bundle.bundle(function (err, src) {
    if (err) throw err
    app.assets['/index.js'] = src
    
    // Create the server
    // Code that follows is a classic trickle-down-style router.
    Connect.createServer(
    
      // Serve a route
      function (req, res, next) {
        var action = app.route(req)    
        if (action) action(req, res)
        else next()
      }
      
      // Serve dynamic asset
    , function (req, res, next) {
        if (app.assets[req.url]) {
          res.writeHead(200)
          res.end(app.assets[req.url])
        } else next()
      }
    
      // Serve static asset
    , function (req, res, next) {
      
         asset = path.join(app.root, 'assets', req.url)
         if (fs.existsSync(asset) && fs.lstatSync(asset).isFile()) {
           asset = fs.readFileSync(asset).toString()  
           res.writeHead(200)
           res.end(asset)
         } else next()
      }
    
      // Serve 404 error
    , function (req, res, next) {
        res.writeHead(404, { "Content-Type": "text/plain" })
        res.write("404 Not found")
        res.end()
      }
      
    )
    
    // Start the server
    .listen(app.port)
    console.log('Listening on port ' + app.port + '.')
  })

})