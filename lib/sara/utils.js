/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

var _ = module.exports = require('lodash')

_.mixin({
  add: function (obj, func) {
    if (arguments.length > 1) {
      this[obj] = func
      return this
    } else {
      if (obj instanceof Function && obj.name) {
        this[obj.name] = obj
        return this
      }
      if (obj instanceof String) return this[obj]
    }
    return false
  }
  
, method: function (obj, func) {
    if (arguments.length > 1) {
        this.prototype[obj] = func
      return this
    } else {
      if (obj instanceof Function && obj.name) {
        this.prototype[obj.name] = obj
        return this
      }
      if (obj instanceof String) return this.prototype[obj]
    }
    return false
  }

, trimExtension: function () {
    return this.match(/\.[^\/.]+$/, '')[0]
  }

, firstValue: function (object) {
    for (var key in object) return object[key]
  }

, typeOf: function (object) {
    if (object instanceof Array) return 'array'
    else if (object === null) return 'null'
    else if (object instanceof RegExp) return 'regexp'
    else return typeof object
  }

, capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }
  
, pluralize: function (str) {
    str = str.toLowerCase()
    if (str[str.length - 1] !== 's') str += 's'
    return str
  }
})