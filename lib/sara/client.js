var http = require('http')

module.exports = function Client(app) {
  app.route({ method: 'GET', url: window.location.pathname })({}, {
    end: function () {}
  , writeHead: function () {}
  })

  /**
   * BLUR
   */
  document.addEventListener('blur', function () {
  })

  /**
   * CHANGE
   */
  document.addEventListener('change', function () {
  })

  /**
   * CLICK
   */
  document.addEventListener('click', function (event) {
    if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass')) {
      event.preventDefault()

      history.pushState(null, event.target.textContent, event.target.href)

      app.visit(event.target.pathname)(
        new http.ClientRequest()
      , new http.ServerResponse()
      )
    }
  })

  /**
   * CONTEXTMENU
   */
  document.addEventListener('contextmenu', function () {
  })

  /**
   * COPY
   */
  document.addEventListener('copy', function () {
  })

  /**
   * CUT
   */
  document.addEventListener('cut', function () {
  })

  /**
   * DBLCLICK
   */
  document.addEventListener('dblclick', function () {
  })


  /**
   * ERROR
   */
  document.addEventListener('error', function () {
  })

  /**
   * FOCUS
   */
  document.addEventListener('focus', function () {
  })

  /**
   * FOCUSIN
   */
  document.addEventListener('focusin', function () {
  })

  /**
   * FOCUSOUT
   */
  document.addEventListener('focusout', function () {
  })

  /**
   * HASHCHANGE
   */
  document.addEventListener('hashchange', function () {
  })

  /**
   * KEYDOWN
   */
  document.addEventListener('keydown', function () {
  })

  /**
   * KEYPRESS
   */
  document.addEventListener('keypress', function () {
  })

  /**
   * KEYUP
   */
  document.addEventListener('keyup', function () {
  })

  /**
   * LOAD
   */
  document.addEventListener('load', function () {
  })

  /**
   * MOUSEDOWN
   */
  document.addEventListener('mousedown', function () {
  })

  /**
   * MOUSEENTER
   */
  document.addEventListener('mouseenter', function () {
  })

  /**
   * MOUSELEAVE
   */
  document.addEventListener('mouseleave', function () {
  })

  /**
   * MOUSEMOVE
   */
  document.addEventListener('mousemove', function () {
  })

  /**
   * MOUSEOUT
   */
  document.addEventListener('mouseout', function () {
  })

  /**
   * MOUSEOVER
   */
  document.addEventListener('mouseover', function () {
  })

  /**
   * MOUSEUP
   */
  document.addEventListener('mouseup', function () {
  })

  /**
   * MOUSEWHEELE
   */
  document.addEventListener('mousewheele', function () {
  })

  /**
   * PASTE
   */
  document.addEventListener('paste', function () {
  })

  /**
   * RESET
   */
  document.addEventListener('reset', function () {
  })

  /**
   * RESIZE
   */
  document.addEventListener('resize', function () {
  })

  /**
   * SCROLL
   */
  document.addEventListener('scroll', function () {
  })

  /**
   * SELECT
   */
  document.addEventListener('select', function () {
  })

  /**
   * SUBMIT
   */
  document.addEventListener('submit', function () {
  })

  /**
   * TEXTINPUT
   */
  document.addEventListener('textinput', function () {
  })

  /**
   * UNLOAD
   */
  document.addEventListener('unload', function () {
  })

  /**
   * WHEEL
   */
  document.addEventListener('wheele', function () {
  })

}