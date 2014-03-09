/*!
 *
 * VIEW
 *
 * Code here should make Sara adaptable to most view layers.
 *
 */

// Modules
var _ = require('./utils')
  , path = require('path')
  , DOM = require('jsdom')
  , stream = require('stream')
  , Trumpet = require('trumpet')

// Constants
var IS_SERVER = !process.browser
  , IS_CLIENT = !!process.browser
  , Readable = stream.Readable
  , Writable = stream.Writable

var View = module.exports = (function View(name, options) {
  var Sara = require('../sara')

  this.template = options.template

  if (options.initialize instanceof Function) options.initialize()

  if (options.render) this.render = function (context, callback) {
    var readable = new Readable()

    if (IS_SERVER) {
      var id = Date.now()

      // Pre-render if available, otherwise, render
      if (options.prerender instanceof Function) {
        var trumpet = Trumpet()
          , head = trumpet.select('head').createStream()
          , writable = new Writable()

        writable._write = function (chunk, encoding, callback) {
          head.write(chunk.toString())
          callback()
        }

        readable._read = function () {
          this.push(Sara.layout.toString())
          this.push(null)
        }

        head.pipe(writable)

        head.write('<meta name="saraClientId" content="' + id + '">')
        head.write('<script src="/index.js" type="text/javascript"></script>')

        _(Sara.templates).forIn(function (templateContent, id) {
          if (id === 'layout') return false
          head.write('<script type="text/template" data-template="' + id + '">'
                   + _.htmlEncode(templateContent.toString())
                   + '</script>')
        })

        _(Sara.resources).forEach(function (resource) {
          head.write('<script type="text/json" data-model="' + resource.name.toLowerCase() + '">'
                   + JSON.stringify(_.decycle(resource.all().data()))
                   + '</script>')
        })

        head.on('end', head.end)

        // Stream the prerender function
        options.prerender.bind(trumpet)(context)

        return readable.pipe(trumpet)
      } else {
        var window = DOM.jsdom(Sara.layout, null, { url: global.window.location.pathname }).parentWindow

        window.console = console
        window.onerror = console.error

        var head = window.document.head
          , js = window.document.createElement('script')
          , meta = window.document.createElement('meta')

        js.type = 'text/javascript'
        js.src = '/index.js'
        head.insertBefore(js, head.firstChild)

        meta.name = 'saraClientId'
        meta.content = String(id)
        head.insertBefore(meta, head.firstChild)

        // Bootstrap templates
        _(Sara.templates).forIn(function (templateContent, id) {
          if (id === 'layout') return false
          var template = window.document.createElement('script')
          template.type = 'text/template'
          template.setAttribute('data-template', id)
          template.textContent = _.htmlEncode(templateContent.toString())
          head.insertBefore(template, head.firstChild)
        })

        // Bootstrap data
        _(Sara.resources).forEach(function (resource) {
          var json = window.document.createElement('script')
          json.type = 'text/json'
          json.setAttribute('data-model', resource.name.toLowerCase())
          json.textContent = JSON.stringify(_.decycle(resource.all().data()))
          head.insertBefore(json, head.firstChild)
        })

        window.autoPrerender = true
        window.run(Sara.assets['/index.js'].contents.toString())
        Sara.clients[id] = window

        readable._read = function () {
          this.push(window.document.innerHTML)
          this.push(null)
        }

        return readable
      }
    } else if (IS_CLIENT) {
      global._ = _
      options.render(context)
      readable._read = function () {}
      return readable
    }

    return false
  }.bind(this)
})
