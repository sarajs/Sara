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
  , fresh = require('fresh')
  , crypto = require('crypto')
  , compress = require('compression')

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
    .ignore('mongodb')
    .ignore('graceful-fs')
    .ignore('pg')
    .ignore('./pg')
    .ignore('pg-query-stream')
    .ignore('require-like')
    .ignore('url')
    .ignore('child_process')
    .ignore('phantomjs')
    .ignore('webshot')
    .ignore('sara/lib/adapters/postgresql')
    .ignore('crypto')
    // .ignore('buffer')
    // .ignore('dLwtzX')

  _(Sara.ignored).forEach(function (id) {
    Sara.bundle.ignore(id)
  })

  Sara.bundle.add(Sara.root) // Compile the app
    .bundle({ insertGlobals: true }, function (err, src) {
      if (err) throw err
      if (~['production', 'test'].indexOf(Sara.env) && Sara.minified) {
        src = uglify.minify(src, {
            fromString: true
          , mangle: false
        }).code
      }

      var md5sum = crypto.createHash('md5')
        , contents = new Buffer(src)

      md5sum.update(contents)

      Sara.assets['/index.js'] = { contents: contents, filepath: 'index.js', etag: md5sum.digest('hex') }

      Sara.log('Starting server...')

      // Create the server
      // Code that follows is a classic "trickle-down diplomacy" router.
      var server = connect(
          compress()

          // Serve a route
        , function (req, res, next) {
          var action = Sara.route(req, res)

          if (action instanceof Function) {
            res.writeHead(200, {
              'Content-Type': 'text/html'
            })
            global.window.location = url.parse(req.url)
            action(req, res)
          }

          else next()
        }

        // Serve static asset
      , function (req, res, next) {
          if (Sara.assets[req.url]) {
            if (!~['production', 'test'].indexOf(Sara.env)) {
              if (Sara.assets[req.url].filepath !== 'index.js') {
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
                res.end(Sara.assets[req.url].contents)
              }
            } else {
              var asset = Sara.assets[req.url]
                , type = mime.lookup(asset.filepath)
                , charset = mime.charsets.lookup(type)

              res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
              res.setHeader('Cache-Control', 'public, max-age=86400')
              res.setHeader('Etag', asset.etag)

              if (fresh(req.headers, res._headers)) {
                res.writeHead(304)
                res.end()
              } else {
                res.writeHead(200)
                res.end(asset.contents)
              }
            }
          } else next()
        }

        // Serve static template
      , function (req, res, next) {
          var template = path.join(Sara.root, 'templates', req.url)

          if (fs.existsSync(template) && fs.statSync(template).isFile()) {
            fs.readFile(template, function (err, chunk) {
              var template = chunk.toString()
              res.writeHead(200)
              res.end(template)
            })
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

      // Start the server
      var httpServer = http.createServer(server).listen(Sara.port)
      , socket = engine.attach(httpServer)

      Sara.log('Listening on port ' + Sara.port + '...')
      Sara.log('Ready!')

      _(Sara.resources).forIn(function (Constructor, callback) {
        var adapter = Sara.adapter || adapterNeDB

        adapter(Constructor, function (datastore) {
          var db = Constructor.db = datastore
          db.find().stream().pipe(_.concatStream(function (data) {
            Constructor.lastId = data.length ? data[data.length - 1].id : 0
          }))
        })
      })

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
}
