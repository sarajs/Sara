/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

var _ = module.exports = require('lodash')

_.mixin({

  /**
   *
   * Add one object to another by string or function name.
   * @param {String|Function} - obj - If you pass a named function, it will add the function by name to the object immediate.
   * If you pass a string and no other arguments, it will return the value for that key.
   * @param {Function} - func - If you pass a second parameter, it will always assign it as the value for the key of the first parameter on the object immediate.
   * @returns {this|Function|false}
   *
   */
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
  
  /**
   *
   * Add one object to another by string or function name.
   * @param {String|Function} - obj - If you pass a named function, it will add the function by name to the object's prototype.
   * If you pass a string and no other arguments, it will return the value for that key.
   * @param {Function} - func - If you pass a second parameter, it will always assign it as the value for the key of the first parameter on the object's prototype.
   * @returns {this|Function|false}
   *
   */
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

  /**
   *
   * Removes the extension from a string.
   *
   */
, trimExtension: function () {
    return this.match(/\.[^\/.]+$/, '')[0]
  }

  /**
   *
   * Retreives the very first key from an object as a string.
   * @param {Object} - object
   * @returns {String}
   *
   */
, firstKey: function (object) {
    for (var key in object) return String(key)
  }

  /**
   *
   * Retreives the very first value from an object without knowing the key.
   * @param {Object} - object
   * @returns {Object}
   *
   */
, firstValue: function (object) {
    for (var key in object) return object[key]
  }

  /**
   *
   * Gets the type of an object with more completeness than JavaScript's native `typeof`.
   * @param {Object} - object
   * @returns {String}
   *
   */
, typeOf: function (object) {
    if (object instanceof Array) return 'array'
    else if (object === null) return 'null'
    else if (object instanceof RegExp) return 'regexp'
    else return typeof object
  }

  /**
   *
   * Capitalize the first letter of a string.
   * @param {String} - str
   * @returns {String}
   *
   */
, capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }

  /**
   *
   * Pluralize a string.
   * @param {String} - str
   * @returns {String}
   *
   */  
, pluralize: function (str) {
    str = str.toLowerCase()
    if (str[str.length - 1] !== 's') str += 's'
    return str
  }

  /**
   *
   * Quickly places the _.add() and _.method() functions on an object for easy prototyping.
   * @param {Object} - obj
   * @returns {Object}
   *
   */
, class: function (obj) {
    obj.method = _.method
    obj.add = _.add
    return obj
  }
})