module.exports = function ClientConstructor(app) {
  // Kill link click-throughs
  document.addEventListener('click', function (event) {
    var anchors = document.querySelectorAll('a:not([data-bypass])')
      , i = anchors.length

    while (i--) {
      if (anchors[i].host === window.location.host) {
        event.preventDefault()
        app.visit(anchors[i].pathname)
        anchors[i].parentNode.replaceChild(anchors[i], anchors[i].cloneNode(true))
      }
    }
  })
}