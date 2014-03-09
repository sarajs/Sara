/*!
 *
 * SARA
 *
 * The application class, which in a traditional MVC sense would be the router.
 *
 */

// Modules
var _ = require('./sara/utils')
  , path = require('path')
  , View = require('./sara/view')
  , Model = require('./sara/model')
  , Event = require('./sara/event')
  ,  Collection = require('./sara/collection')
  , Controller = require('./sara/controller')
  , setupServer = require('./sara/server')
  , setupClient = require('./sara/client')
  , url = require('url')
  , fs = require('fs')
  , DOM = require('jsdom')

// Constants
var APP = null
  , IS_SERVER = !process.browser
  , IS_CLIENT = !!process.browser
  , red, blue, yellow, normal  

if (IS_SERVER) red = '\x1B[31m', blue = '\x1B[34m', normal = '\x1B[39m', yellow = '\x1B[33m'
else red = blue = normal = yellow = ''

/**
 *
 * The application class.
 * @constructor
 * @param {Object} - options - A hash of options to create your application by.
 * @returns {Object} A Sara instance.
 *
 */
function Sara() {
  // Singleton goodness
  if (APP !== null) return APP
  if (!(this instanceof Sara)) return new Sara()
  
  this.port = process.env.PORT || 1337
  this.env = process.env.NODE_ENV
  this.db = null
  this.cache = {}
  this.resources = {}
  this.history = {}
  this.paths = {}
  this.processors = {}
  this.assets = {}
  this.clients = {}
  this.templates = {}
  this.initialized = false
  this.middleware = []

  this.log([
    '',
    blue,
    '                          .. .. .',
    '                      . MMMDMM8MMNM~  .',
    '                 =NMMMMMMMMMMMMMMMMM78..',
    '            .MM?NM?MMMN8N:I8MMMO+NMD$MMD .',
    '          . MDNI+DDM$7?MMMMMMMN8MN7IM$DMIMI  .',
    '           +Z?=M~OM?IMNMMMMMMMMMMMMMMN8MM8:.O',
    '          . MMM?Z,8MDMMNMM,?MMM~MMMMMM8MMOIMZ :',
    '             NMMMMMMMMM7NN?D:?ZZMMMMMMMMNMMMNND N.',
    '            . .MMMNDM..MMZM .  MIMMMMMMMMMM8M:,=.Z.',
    '                 MM~       ....  Z8OMMMMMMNMM8~N78',
    '                .MM.~.  .::$$$... .NMMDMMMNMMMMM.',
    '              .MMMM,O=D.,IM8MMNM...NDMMMMMMMMM',
    '       .  .   D8MM ZMMN .. ZN?.. ..ZDMM$MMMMN:',
    '       . MMMM8:MM DMMM,.          . O7,~MMM+M.',
    '    M=M8DM .   ~MM .  . .          .. DMMMMNM7.',
    '   MN~ .    ... MM8 , M . .          .MMMMMMMN',
    ' .  .      MM7 OMM .$  M?  ..        M=MMMMMM',
    '           :7. .     M..MMMM .      .MMMMMM:.',
    '                     .~  NM          M,M?MM',
    '                       M..    .  Z     NMI',
    '                        M .  .MM       . .',
    '                        :MMMMNMI       MN.',
    '                          l:::.M      .= .',
    '                          l:::Z.      7MD',
    '                        :MMDMDI.,.. ..NMM.',
    '                       .MMMMMMM=..Z= N..MM.',
    '                      .MM MM8ZDNM  . .M MIM..',
    '                     DMDMMMDNMDONMMMMMMMNDZMN .',
    '  ' + yellow + '______' + blue + '        ..MMMMMM=8MMM8I8MMM.MMMM  =M .',
    ' ' + yellow + '/      \\' + blue + '        MMMMZ8$7NMMMMMMMODNOMDMM~7ZMM.',
    '' + yellow + '/|  $$$$$$\\ ______    ______   ______            __   _______',
    '| $$___\\$$ |      \\  /      \\ |      \\          |  \\ /       \\   ',
    ' \\$$    \\   \\$$$$$$\\|  $$$$$$\\ \\$$$$$$\   \        \\$$|  $$$$$$$',
    ' _\\$$$$$$\\ /      $$| $$   \\$$/      $$         |  \\ \\$$    \\    ',
    '|  \\__| $$|  $$$$$$$| $$     |  $$$$$$$ __      | $$ _\\$$$$$$\\      ',
    ' \\$$    $$ \\$$    $$| $$      \\$$    $$|  \\     | $$|       $$     ',
    '  \\$$$$$$   \\$$$$$$$ \\$$       \\$$$$$$$ \\$$__   | $$ \\$$$$$$$    ',
    '                                          |  \\__/ $$                  ',
    '                                           \\$$    $$                  ',
    '                                            \\$$$$$$' + normal
  ].join('\n       '), false)
}

// Some other fun things
Sara.Utils = _

Sara.prototype.Collection = Collection
Sara.prototype.Controller = Controller
Sara.prototype.Event = Event
Sara.prototype.Model = Model
Sara.prototype.View = View
Sara.prototype._routes = {
  'GET': {}
, 'POST': {}
, 'PUT': {}
, 'PATCH': {}
, 'HEAD': {}
, 'DELETE': {}
}
/**
 * Extend the Sara class with an adapter
 * @param {Object} - adapter - a NodeJS module which exports View and Controller constructors.
 * @returns {Object} The Sara application class.
 *
 * FIXME: Adapters should be app-specific, not process-specific. This should really be a method.
 */
Sara.prototype.storage = function (name, adapter) {
  this.name = name
  this.adapter = adapter
  return this
}

Sara.prototype.log = function (msg, prefix) {
  prefix = prefix !== false ? red + '[sara] ' : prefix ? prefix : ''
  if (!global.autoPrerender && this.env !== 'production') console.log(prefix + msg + normal)
  return this
}

/**
 * Load a template and serve it for client-side rendering.
 * @param {String} - id - An id to reference the template by. FEMIX: none of this ever
 * @param {String} - filepath - Relative path to the template
 * @param {Number} - index - A private parameter to get the stack index via.
 */
Sara.prototype.template = function (id, filepath, index) {
  if (IS_SERVER) {
    var resolved = path.resolve(path.dirname(_.filepathFromStackIndex(index || 2)), filepath)
      , contents = fs.readFileSync(resolved)
    var templ = {
      content: contents
    , id: id
    , toString: function () {
        return this.content.toString()
      }
    }
    this.templates[id] = templ
    return templ
  } else if (IS_CLIENT) {
    var script = document.querySelector('script[data-template=' + id + ']')
    return {
      content: _.htmlDecode(script.textContent)
    , id: id
    , toString: function () {
        return this.content.toString()
      }
    }
  }
}

/**
 * Loads a template designed as the app's static layout.
 * @param {String} - filepath - Relative path to the layout file.
 */
Sara.prototype.layout = function (filepath) {
  if (IS_SERVER) {
    this.log('Parsing layout file (' + filepath + ')...')
    this.layout = this.template('layout', filepath, 3)
    if (global.autoPrerender) {
      document.innerHTML = this.layout.toString()
    } else {
      global.document = DOM.jsdom(this.layout.toString())
      global.window = global.document.parentWindow
      _(global).defaults(window)
    }
  }
  return this
}

/**
 * Define routes to serve on the client via history.pushstate
 */
Sara.prototype.routes = function (actions) {
  for (var route in actions) {
    this.get(route, actions[route])
    this.paths[route] = actions[route]
  }
  this.log('Starting the router...')
  return this
}

/**
 * Define GET, POST, PUT, and DELETE routes.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 */
Sara.prototype.all = function (routes, action) {
  return this.get(routes, action)
  return this.post(routes, action)
  return this.put(routes, action)
  return this.patch(routes, action)
  return this.delete(routes, action)
  return this.head(routes, action)
}

Sara.prototype.get = function (routes, action) {
  return this.createRoutes('GET', routes, action)
}

Sara.prototype.post = function (routes, action) {
  return this.createRoutes('POST', routes, action)
}

Sara.prototype.put = function (routes, action) {
  return this.createRoutes('PUT', routes, action)
}

Sara.prototype.patch = function (routes, action) {
  return this.createRoutes('PATCH', routes, action)
}

Sara.prototype.delete = function (routes, action) {
  return this.createRoutes('DELETE', routes, action)
}

Sara.prototype.head = function (routes, action) {
  return this.createRoutes('HEAD', routes, action)
}

/**
 * An internal method for safely defining an array of routes
 * Used in the .[crud] methods which take strings or arrays
 * @param {method} - string - A method name.
 */
Sara.prototype.createRoutes = function (method, paths, action) {
  if (_.typeOf(paths) == 'string') paths = [paths]

  if (_.typeOf(paths) == 'array') {
    paths.forEach(function (path) {
      if (_.typeOf(path) !== 'string') fail()

      var routeKeys = []
        , routePattern = _.pathRegexp(path, routeKeys)

      this._routes[method.toUpperCase()][path] = {
        action: action
      , keys: routeKeys
      , pattern: routePattern
      }
    }.bind(this))

    return this
  } else fail()

  function fail() {
    throw new Error("First argument of ." + method.toLowerCase() + "() must be a string or array of strings.")
  }
}

Sara.prototype.static = function (directory) {
  if (IS_SERVER) {
    directory = path.join(path.dirname(_.filepathFromStackIndex(2)), directory)

    var files = fs.readdirSync(directory)
    _(files).forEach(function (file) {
      var filepath = path.join(directory, file)
        , contents = fs.readFileSync(filepath)
      this.assets['/' + file] = { filepath: filepath, contents: contents }
    }.bind(this))
  }

  return this
}

/**
 *
 * Start the router of a Sara instance.
 * Works as both app.init()
 *
 */
Sara.prototype.init = function (options, fn) {
  _(this).extend(options)
  if (IS_SERVER) {
    this.root = _.filepathFromStackIndex(2)
    setupServer(this, callback.bind(this))
  } else if (IS_CLIENT) setupClient(this, callback.bind(this))

  function callback() {
    this.initialized = true
    if (fn instanceof Function && IS_CLIENT) fn.bind(this)()
  }

  return this
}

Sara.prototype.use = function (mw) {
  this.middleware.push(mw)
  return this
}

/**
 * Retreive a route from a request object.
 * @param {String} - route - A URL to access the action by.
 * @param {Function} - action - An action which renders a view.
 *
 * FIXME: In the for loop it appears to call the route's action explicitly, seems wrong. Someone was high (it was me).
 *
 * FIXME: This method shouldn't take a request object, it should take a URL and a method. ;-)
 */
Sara.prototype.route = function (req, res) {
  var method = req.method.toUpperCase()

  for (var route in this._routes[method]) {
    var routeObject = this._routes[method][route]
      , match = req.url.match(routeObject.pattern)
      , action = routeObject.action
      , keys = routeObject.keys

    if (match && match[0] === req.url) {
      match.shift() // Shift off the original URL
      req.params = {}
      _(keys).forEach(setParam)
      return action
    }
  }

  return null

  function setParam(key, i) {
    req.params[key.name] = match[i]
  }
}

/**
 * A shortcut to routing a get request
 * @param {String} - url - A URL to visit.
 */
Sara.prototype.visit = function (url) {
  return this.route({ method: 'GET', url: url })
}

module.exports = new Sara().log('Starting your Sara app..')
