/*!
 *
 * EVENT
 * A tiny event library for Sara.
 * Basically me avoiding forking JSDOM in order to resolve DOM implementation inconsistencies.
 *
 */

function Event(e, upstream) {
  var app = this.constructor.app

  switch (e.type) {
  case 'add':
    new app.resources[e.resource](e.data).save(false)
    break
  case 'change':
    app.resources[e.resource].find(e.id).set(e.name, e.value, false)
    break
  case 'remove':
    app.resources[e.resource].find(e.id).destroy(false)
    break
  }
}

module.exports = Event
