/*!
 *
 * VIEW
 *
 * Code here should make Sara adaptable to most view layers.
 *
 */

var Sara = require('../sara')
  , _ = require('./utils')
  , path = require('path')
  , vm = require('vm')
  , DOM = require('jsdom')
  , requireLike = require('require-like')

var View = module.exports = (function View(name, options) {
  this.template = options.template

  if (IS_SERVER) var requireLikeView = requireLike(_.filepathFromStackIndex(2))

  if (options.render) this.render = function (data, res) {
    if (IS_SERVER) {
      var id = Date.now()
        , document = DOM.jsdom(this.constructor.app.layout)
        , window = document.parentWindow

      _(window).defaults(DOM.level(3, 'events'))

      window.onerror = console.error
      alert = console.log // FIXME: The usefulness of this needs to be debated.

      var head = window.document.head
        , js = window.document.createElement('script')
        , meta = window.document.createElement('meta')

      js.type = 'text/javascript'
      js.src = '/index.js'
      head.insertBefore(js, head.firstChild)

      meta.name = 'saraClientId'
      meta.content = String(id)
      head.insertBefore(meta, head.firstChild)

      _(this.constructor.app.templates).forIn(function (templateContent, id) {
        var template = window.document.createElement('script')
        template.type = 'text/template'
        template.setAttribute('data-template', id)
        template.textContent = _.htmlEncode(templateContent.toString())
        head.insertBefore(template, head.firstChild)
      })

      _(this.constructor.app.resources).forEach(function (resource) {
        var json = window.document.createElement('script')
        json.type = 'text/json'
        json.textContent = JSON.stringify(_.decycle(resource.all().data()))
        head.insertBefore(json, head.firstChild)
      })

      options.render(document)

      this.constructor.app.clients[id] = window
      return window.document.innerHTML
    } else if (IS_CLIENT) {
      global._ = _
      options.render(global.document)
      return global.window.document.documentElement.outerHTML
    }

    return false
  }.bind(this)
})
