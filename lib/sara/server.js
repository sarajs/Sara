/*!
 *
 * SERVER
 *
 * Server versions of Sara methods.
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
  , DOM = require('jsdom')
  , util = require('util')
  , Contextify = require('contextify')
  , Readable = require('stream').Readable
  , requireLike = require('require-like')
  , through = require('through')

// Isomorphism
var window = DOM.jsdom().parentWindow
_(window).defaults(DOM.level(3, 'events'))
_(global).defaults(window)
window.onerror = console.error
alert = console.log // FIXME: The usefulness of this needs to be debated.

/**
 *
 * A server constructor?
 * @constructor
 * @param {Object} - app - A Sara instance.
 * @returns {Object} ???????
 *
 * FIXME: Why the fuck is this a constructor?
 *
 */
var Server = module.exports = (function Server(app) {
  var engine = require('engine.io')
    , http = require('http')

  // FIXME: Fuck all this code here.
  app.bundle = browserify()
  app.bundle.ignore('./sara/server') // Prevent sara/server form loading
  app.bundle.ignore('jsdom')
  app.bundle.ignore('nedb')
  app.bundle.ignore('path')
  app.bundle.ignore('fs')
  app.bundle.add(path.join(__dirname, '../sara')) // Compile Sara
  app.bundle.add(require.main.filename) // Compile the app

  // Compile the bundle and give it an asset route
  app.bundle.bundle(function (err, src) {
    if (err) throw err
    app.assets['/index.js'] = src

    // Create the server
    // Code that follows is a classic trickle-down-style router.
    var server = Connect.createServer(

      // Serve a route
      function (req, res, next) {
        var action = app.route(req)

        if (action) {          
          action(req, res)
        }
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
         var asset = path.join(app.root, 'assets', req.url)

         if (fs.existsSync(asset) && fs.statSync(asset).isFile()) {
           asset = fs.readFileSync(asset).toString()
           res.writeHead(200)
           res.end(asset)
         } else next()
      }

      // Serve static template
    , function (req, res, next) {
        var template = path.join(app.root, 'templates', req.url)

        if (fs.existsSync(template) && fs.statSync(template).isFile()) {
          template = fs.readFileSync(template).toString()
          res.writeHead(200)
          res.end(template)
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
    var httpServer = http.createServer(server).listen(app.port)
      , socket = engine.attach(httpServer)

    console.log('Listening on port ' + app.port + '.')

    socket.on('connection', function (socket) {
      socket.on('message', function (json) {
        var e = JSON.parse(json)

        var client = _.where(app.clients, { clientId: parseInt(e.clientId) })
        if (client.length) {
          client[0].socketId = socket.id
          client[0].socket = socket
        } else { } // FIXME: implement #59 here

        if (e.type !== undefined) {
          var target = nodeFromSaraIdAndClientId(e.target.saraId, e.clientId)

          // If the target sent by the client can't be found on the server, something is wrong, refresh the client
          if (!target) {
            socket.send(JSON.stringify({ refresh: true }))
          }

          new Sara.Event({
            type: e.type
          , target: target
          , bubbles: true
          , document: app.clients[e.clientId].document
          , cancelable: true
          , which: e.which
          , charCode: e.charCode
          , targetValue: e.target.value
          , srcElement: nodeFromSaraIdAndClientId(e.srcElement.saraId, e.clientId)
          })
        }
      })

      socket.on('close', function () {
        _.where(app.clients, { socketId: socket.id }).forEach(function (client) {
          _.pull(app.clients, client)
        })
      })
    })

    /**
     * SOME SERVER UTILITIES
     */

    // Retreives a DOM node based on a SaraId and ClientId
    function nodeFromSaraIdAndClientId(saraId, clientId) {
      var indices = saraId.split('.')
      , target = app.clients[clientId].document

      indices.forEach(function (index) {
        var childElements = _.filter(target.childNodes, function (node) {
          return node.nodeType === 1
        })

        target = childElements[index]
      })

      return target
    }

    // Creates a stream from a string
    function streamFromString(string) {
      var stream = new Readable()

      stream._read = function() {
        stream.push(string)
        string = null
      }

      return stream
    }
  })
})
