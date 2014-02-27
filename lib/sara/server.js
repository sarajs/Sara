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
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , _ = require('./utils')
  , DOM = require('jsdom')
  , async = require('async')
  , adapterNeDB = require('../adapters/nedb')

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
var Server = module.exports = function setupServer(app, callback) {
  var engine = require('engine.io')
    , http = require('http')

  // FIXME: Fuck all this code here.
  app.bundle = browserify()
  app.bundle.ignore('./sara/server') // Prevent sara/server form loading
  app.bundle.ignore('jsdom')
  app.bundle.ignore('nedb')
  app.bundle.ignore('fs')
  app.bundle.ignore('nedb')
  app.bundle.ignore('mongodb')
  app.bundle.add(path.join(__dirname, '../sara')) // Compile Sara
  app.bundle.add(require.main.filename) // Compile the app
  app.clientId = 0
  app.socket = {
    send: function (e) {
      _(this.clients).forIn(function (client, id) {
        if (JSON.parse(e).clientId != id) client.socket.send(e)
      })
    }.bind(app)
  }

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
          var response = action()
          switch (_.typeOf(response)) {
            case 'string':
            case 'buffer':
              res.end(response)
              break
            case 'number':
              res.writeHead(404, { "Content-Type": "text/plain" })
              res.end('404 not found')
          }
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
        res.end('404 not found')
      }

    )

    // Start the server
    var httpServer = http.createServer(server).listen(app.port)
      , socket = engine.attach(httpServer)

    console.log('Listening on port ' + app.port + '.')

    socket.on('connection', function (socket) {
      socket.on('message', function (json) {
        var e = JSON.parse(json)

        var client = app.clients[e.clientId]
        if (client !== undefined) {
          client.socketId = socket.id
          client.socket = socket
        } else { } // FIXME: implement #59 here

        if (e.resource !== undefined) {
          new app.Event(e)
          app.socket.send(json)
        }
      })

      socket.on('close', function () {
        for (var id in app.clients) {
          if (app.clients[id].socketId == socket.id) delete app.clients[id]
        }
      })
    })

    async.every(_.values(app.resources), function (Constructor, callback) {
      var adapter = app.adapter || adapterNeDB

      adapter(Constructor, function (datastore) {
        var db = Constructor.db = datastore

        // Load the db
        db.find({}, function (err, docs) {
          if (err) throw err
          if (docs.length) {
            docs.forEach(function (doc) {
              new Constructor(doc).push()
            })
          }
          callback(true)
        })
      })
    }, function (result) {
      callback()
    })
  })
}
