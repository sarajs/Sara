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
  global.root = app.root = path.dirname(require.main.filename)
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
          var clientId = Date.now()
            , document = DOM.jsdom(app.template)
            , window = document.parentWindow

          _(window).defaults(DOM.level(3, 'events'))

          window.onerror = console.error
          alert = console.log // FIXME: The usefulness of this needs to be debated.

          var sandbox = {
            clientId: clientId
          , window: window
          , document: document
          , req: req
          , res: res
          }

          _(sandbox).defaults(global)

          var head = window.document.head
            , js = window.document.createElement('script')
            , json = window.document.createElement('script')
            , meta = window.document.createElement('meta')

          js.type = 'text/javascript'
          js.src = '/index.js'

          json.type = 'text/json'
          json.textContent = JSON.stringify(_.decycle(app.resources.Todo.all().data()))

          meta.name = 'saraClientId'
          meta.content = String(clientId)

          head.insertBefore(js, head.firstChild)
          head.insertBefore(json, head.firstChild)
          head.insertBefore(meta, head.firstChild)

          Contextify(sandbox)

          var b = browserify({ basedir: path.dirname(require.main.filename)  })
            .ignore('./sara/server') // Prevent sara/server from loading
            .ignore('jsdom')
            .ignore('nedb')
            .ignore('path')
            .ignore('fs')
            .require(streamFromString(_.getBody(action)))
            .bundle(function (err, src) {
              if (err) throw err
              sandbox.run(src)
              app.clients.push(sandbox)
            })
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
        } else { // FIXME: this block is duplicate of code above
          // var clientId = e.clientId
          //   , window = DOM.jsdom(app.template).parentWindow

          // _(window).defaults(DOM.level(3, 'events'))

          // window.onerror = console.error
          // alert = console.log // FIXME: The usefulness of this needs to be debated.

          // app.clients.push({
          //   clientId: clientId
          // , window: window
          // })

          // var head = window.document.head
          //   , js = window.document.createElement('script')
          //   // , json = window.document.createElement('script')
          //   , meta = window.document.createElement('meta')

          // js.type = 'text/javascript'
          // js.src = '/index.js'

          // // json.type = 'text/json'
          // // json.textContent = JSON.stringify(_.decycle(_.clone(app.resources.Todo.collection)))

          // meta.name = 'saraClientId'
          // meta.content = String(clientId)

          // head.insertBefore(js, head.firstChild)
          // // head.insertBefore(json, head.firstChild)
          // head.insertBefore(meta, head.firstChild)

          // app.route({ url: e.url, method: 'GET' })({}, { end: function () {}, writeHead: function () {} }, window)
        }

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

    function nodeFromSaraIdAndClientId(saraId, clientId) {
      var indices = saraId.split('.')
        , target = _.where(app.clients, { clientId: parseInt(clientId) })[0].window.document

      indices.forEach(function (index) {
        var childElements = _.filter(target.childNodes, function (node) {
                              return node.nodeType === 1
                            })

        target = childElements[index]
      })

      return target
    }
  })
})

function streamFromString(string) {
  var stream = new Readable()

  stream._read = function() {
    stream.push(string)
    string = null
  }

  return stream
}
