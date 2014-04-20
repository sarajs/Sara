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
  , through = require('through')
  , mime = require('mime')
  , url = require('url')

if (global.autoPrerender) {
  global.document = DOM.jsdom()
  global.window = global.document.parentWindow
  _(global).defaults(window)
}

/**
 *
 * A server constructor?
 * @constructor
 * @param {Object} - Sara - A Sara instance.
 * @returns {Object} ???????
 *
 */
var Server = module.exports = function setupServer(Sara, callback) {
  var engine = require('engine.io')
    , http = require('http')

  Sara.log('Browserifying app bundle...')
  Sara.clientId = 0
  Sara.socket = {
    send: function (e) {
      _(this.clients).forIn(function (client, id) {
        if (JSON.parse(e).clientId != id && client.socket !== undefined) client.socket.send(e)
      })
    }.bind(Sara)
  }

  // FIXME: Fuck all this code here.
  Sara.bundle = browserify()

    .ignore('./sara/server') // Prevent sara/server form loading
    .ignore('jsdom')
    .ignore('nedb')
    .ignore('fs')
    .ignore('nedb')
    .ignore('mongodb')
    .ignore('graceful-fs')

    .add(Sara.root) // Compile the app

    .transform({ global: true }, function (file) { // Transform isomorphic modules
      if (Sara.middleware[file] !== undefined) {
        return through(function write(data) {
          this.queue('module.exports=function(server, client){server(\'webshot\', function(){});client(\'webshot\', ' + Sara.middleware[file] + ')}')
        }, function () {
          this.queue(null)
        })
      }
      return through()
    })

    .bundle({ insertGlobals: true }, function (err, src) {
      if (err) throw err
      if (Sara.env === 'production') {
        Sara.log('Compressing app bundle...')
        src = uglify.minify(src, {
          fromString: true
          , mangle: false
          , compress: {
            unused: false
          }
        }).code
      }

      Sara.assets['/index.js'] = { contents: new Buffer(src) }

      Sara.log('Starting server...')

      // Create the server
      // Code that follows is a classic "trickle-down diplomacy" router.
      var server = connect(
        require('compression')()

        // Serve a route
      , function (req, res, next) {
          var action = Sara.route(req)

          if (action instanceof Function) {
            global.window.location = url.parse(req.url)
            action(req, res, function (response) {
              switch (_.typeOf(response)) {
                case 'string':
                case 'buffer':
                  res.end(response)
                  break
                case 'number':
                  res.writeHead(response, { "Content-Type": "text/plain" })
                  res.end('404 not found')
                  break
              }
            })
          }

          else next()
        }

        // Serve static asset
      , function (req, res, next) {
          if (Sara.assets[req.url]) {
            if (Sara.env !== 'production' && Sara.assets[req.url].filepath !== undefined) {
              fs.readFile(Sara.assets[req.url].filepath, function (err, contents) {
                var type = mime.lookup(Sara.assets[req.url].filepath)
                  , charset = mime.charsets.lookup(type)
                _(Sara.filters[path.extname(Sara.assets[req.url].filepath)]).forEach(function (filter) {
                  contents = new Buffer(filter(contents.toString()))
                })
                res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
                res.end(contents)
              })
            } else {
              var contents = Sara.assets[req.url].contents
              _(Sara.filters[path.extname(Sara.assets[req.url].filepath)]).forEach(function (filter) {
                contents = filter(contents.toString())
              })
              res.writeHead(200)
              res.end(contents)
            }
          } else next()
        }

        // Serve static template
      , function (req, res, next) {
          var template = path.join(Sara.root, 'templates', req.url)

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

      Sara.log('Instantiaing database...')
      _.asyncEvery(_.values(Sara.resources), function (Constructor, callback) {
        Sara.log('Loading ' + _.pluralize(Constructor.name.toLowerCase()) + '...')
        var adapter = Sara.adapter || adapterNeDB

        adapter(Constructor, function (datastore) {
          var db = Constructor.db = datastore

          // Load the db
          db.find({}, function (err, docs) {
            if (err) throw err
            if (docs.length) {
              docs.forEach(function (doc) {
                new Constructor(doc, false).push()
              })
            }
            callback(true)
          })
        })
      }, function (result) {
        // Start the server
        var httpServer = http.createServer(server).listen(Sara.port)
        , socket = engine.attach(httpServer)

        Sara.log('Listening on port ' + Sara.port + '...')
        Sara.log('Ready!')

        socket.on('connection', function (socket) {
          socket.on('message', function (json) {
            if (json.split(':')[0] !== 'mw') { // If it's not middleware
              var e = JSON.parse(json)

              var client = Sara.clients[e.clientId]
              if (client !== undefined) {
                client.socketId = socket.id
                client.socket = socket
              } else { } // FIXME: implement #59 here

              if (e.resource !== undefined) {
                new Sara.Event(e)
                Sara.socket.send(json)
              }
            } else { // If it is middleware
              var arg = json.split(':')

              arg.shift() // shift off 'mw'

              var id = arg.shift() // shift off the id
                , name = arg.shift() // shift off the name

              Sara[name](decodeURIComponent(arg[0]).split(',')[0], function (resp) {
                socket.send('mw:' + id + ':' + name + ':' + resp)
              })

            }
          })

          socket.on('close', function () {
            for (var id in Sara.clients) {
              if (Sara.clients[id].socketId == socket.id) {
                Sara.clients[id].dispose()
                delete Sara.clients[id]
              }
            }
          })
        })

        if (callback) callback()
      })
  })
}
