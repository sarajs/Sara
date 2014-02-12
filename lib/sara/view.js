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

var View = module.exports = (function View(name, options) {
  this.template = options.template

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
        , template = window.document.createElement('script')

      js.type = 'text/javascript'
      js.src = '/index.js'
      head.insertBefore(js, head.firstChild)

      meta.name = 'saraClientId'
      meta.content = String(id)
      head.insertBefore(meta, head.firstChild)

      template.type = 'text/template'
      template.setAttribute('data-template', this.template.id)
      template.textContent = this.template.toString()
      head.insertBefore(template, head.firstChild)

      _(this.constructor.app.resources).forEach(function (resource) {
        var json = window.document.createElement('script')
        json.type = 'text/json'
        json.textContent = JSON.stringify(_.decycle(resource.all().data()))
        head.insertBefore(json, head.firstChild)
      })

      var sandbox = _.defaults({
          window: window
        , document: document
        , require: require
        , data: data
        , res: res
        , console: console
        , element: 'main'
      }, this)

      var context = vm.createContext(sandbox)

      vm.runInContext(_.getBody(options.render) + '; res.end(document.innerHTML);', context)

      this.constructor.app.clients[id] = context
    } else if (IS_CLIENT) {
        options.render(data)
    }
  }.bind(this)
})
