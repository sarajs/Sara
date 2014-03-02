/*!
 *
 * EVENT
 * A tiny event library for Sara.
 * Basically me avoiding forking JSDOM in order to resolve DOM implementation inconsistencies.
 *
 */

function Event(e, upstream) {
  var Sara = require('../sara')

  switch (e.type) {
  case 'add':
    new Sara.resources[e.resource](e.data).save(false)
    break
  case 'change':
    Sara.resources[e.resource].find(e.id).set(e.name, e.value, false)
    break
  case 'remove':
    Sara.resources[e.resource].find(e.id).destroy(false)
    break
  }
}

module.exports = Event
