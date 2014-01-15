var Readable = require('stream').Readable

module.exports = function ClientConstructor(app) {
  // Kill link click-throughs
  document.addEventListener('click', function (event) {
    if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass')) {
      event.preventDefault()

      var stream = new Readable({
        highWaterMark: 3
      })

      // Our end method
      .on('end', function (data) {
        history.pushState(null, null, event.target.href)
        document.body.innerHTML = data
      })

      stream.end = function (data) {
        stream.emit('end', data)
      }

      console.log(event.target.pathname)

      app.visit(event.target.pathname)({}, stream)
      // event.target.parentNode.replaceChild(event.target, event.target.cloneNode(true))
    }
  })
}