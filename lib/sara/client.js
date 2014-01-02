/*!
 *
 * CLIENT
 *
 * This class handles events proxied from the server's virtual DOM and passes actions back to the server.
 * This code must rely only on native objects and the browser 'window' object.
 *
 */
 
var Sara = require('../sara')

Sara.template = function (filename) {
  return 'foo'
}

var Client = module.exports = (function ClientConstructor(app) {

})