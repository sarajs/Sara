/*!
 *
 * SERVER
 *
 * Server versions of Sara methods.
 *
 */

// Modules
var connect = require('connect')
  , Sara = require('../sara')
  , browserify = require('browserify')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , _ = require('./utils')
  , DOM = require('jsdom')
  , adapterNeDB = require('../adapters/nedb')
  , uglify = require('uglify-js')

if (global.autoPrerender) {
  global.document = DOM.jsdom()
  global.window = global.document.parentWindow
  _(global).defaults(window)
}

/**
 *
 * A server constructor?
 * @constructor
 * @param {Object} - app - A Sara instance.
 * @returns {Object} ???????
 *
 */
var Server = module.exports = function setupServer(app, callback) {
  var engine = require('engine.io')
    , http = require('http')

  app.log('Browserifying app bundle...')
  app.clientId = 0
  app.socket = {
    send: function (e) {
      _(this.clients).forIn(function (client, id) {
        if (JSON.parse(e).clientId != id && client.socket !== undefined) client.socket.send(e)
      })
    }.bind(app)
  }

  // FIXME: Fuck all this code here.
  app.bundle = browserify()
    .ignore('./sara/server') // Prevent sara/server form loading
    .ignore('jsdom')
    .ignore('nedb')
    .ignore('fs')
    .ignore('nedb')
    .ignore('mongodb')
    .add(app.root) // Compile the app
    .bundle({ insertGlobals: true }, function (err, src) {
      if (err) throw err
      if (app.env === 'production') {
        app.log('Compressing app bundle...')
        src = uglify.minify(src, {
          fromString: true
          , mangle: false
          , compress: {
            unused: false
          }
        }).code
      }

      app.assets['/index.js'] = { contents: new Buffer(src) }

      app.log('Starting server...')

      // Create the server
      // Code that follows is a classic "trickle-down diplomacy" router.
      var server = connect(
        require('compression')()

        , require('body-parser')()

        // Serve a route
        , function (req, res, next) {
          var action = app.route(req)
          , url = require('url')

          if (action) {
            global.window.location = url.parse(req.url)
            var response = action(req, res)
            switch (_.typeOf(response)) {
              case 'string':
              case 'buffer':
                res.end(response)
                break
              case 'number':
                res.writeHead(response, { "Content-Type": "text/plain" })
                res.end('404 not found')
            }
          }

          else next()
        }

        // Serve static asset
        , function (req, res, next) {
          if (app.assets[req.url]) {

            if (app.env !== 'production' && app.assets[req.url].filepath !== undefined) {
              fs.readFile(app.assets[req.url].filepath, function (err, contents) {
                res.end(contents)
              })
            } else {
              res.writeHead(200)
              res.end(app.assets[req.url].contents)
            }
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

      // Add the middleware
      _(this.middleware).forEach(function (mw) {
        server.use(mw)
      })

      app.log('Instantiaing database...')
      _.asyncEvery(_.values(app.resources), function (Constructor, callback) {
        app.log('Loading ' + _.pluralize(Constructor.name.toLowerCase()) + '...')
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
        // Start the server
        var httpServer = http.createServer(server).listen(app.port)
        , socket = engine.attach(httpServer)

        app.log('Listening on port ' + app.port + '...')
        app.log('Ready!')

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
              if (app.clients[id].socketId == socket.id) {
                app.clients[id].dispose()
                delete app.clients[id]
              }
            }
          })
        })

        if (callback) callback()
      })
  })
}
