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

// Constants
var IS_SERVER = !process.browser
  , IS_CLIENT = !!process.browser

var View = module.exports = (function View(name, options) {
  var Sara = require('../sara')

  this.template = options.template

  if (options.initialize instanceof Function) options.initialize()

  if (options.render) this.render = function () {
    if (IS_SERVER) {
      var id = Date.now()
        , window = DOM.jsdom(Sara.layout, null, { url: global.window.location.pathname }).parentWindow

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

      // Pre-render if available, otherwise, render
      if (options.prerender instanceof Function) {
        options.prerender(window.document)
      } else {
        window.run(Sara.assets['/index.js'])
      }

      Sara.clients[id] = window
      return window.document.innerHTML
    } else if (IS_CLIENT) {
      global._ = _
      options.render()
      return global.window.document.documentElement.outerHTML
    }

    return false
  }.bind(this)
})
