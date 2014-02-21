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
   * Removes the extension from a string.
   *
   */
  trimExtension: function () {
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
   * A utility that dynamically creates named functions using eval()
   *
   * @param {String} - name
   * @param {Function} - fn
   * @returns {undefined}
   *
   */
, createNamedFunction: function (name, fn) {
    eval(fn.toString().replace(/^function(.*?)\(/, 'var fn = function ' + name + '('))
    return fn
  }

, getBody: function (fn) {
    var str = fn.toString()
    return str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'))
  }
  
  // Stolen from Crockfrod's JSON.js
, decycle: function (object) {
    'use strict';

    var objects = [],   // Keep a reference to each unique object or array
        paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {

      var i,          // The loop counter
          name,       // Property name
          nu;         // The new object or array

      if (typeof value === 'object' && value !== null &&
                        !(value instanceof Boolean) &&
                        !(value instanceof Date)    &&
                        !(value instanceof Number)  &&
                        !(value instanceof RegExp)  &&
                        !(value instanceof String)) {

        for (i = 0; i < objects.length; i += 1) {
          if (objects[i] === value) {
            return {$ref: paths[i]};
          }
        }

        objects.push(value);
        paths.push(path);

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          nu = [];
          for (i = 0; i < value.length; i += 1) {
            nu[i] = derez(value[i], path + '[' + i + ']');
          }
        } else {
          nu = {};
          for (name in value) {
            if (Object.prototype.hasOwnProperty.call(value, name)) {
              nu[name] = derez(value[name],
                               path + '[' + JSON.stringify(name) + ']');
            }
          }
        }
        return nu;
      }
      return value;
    }(object, '$'));
  }

  // Stolen from Crockfrod's JSON.js
, retrocycle: function ($) {
    'use strict';

    var px =
                /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

    (function rez(value) {

      var i, item, name, path;

      if (value && typeof value === 'object') {
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          for (i = 0; i < value.length; i += 1) {
            item = value[i];
            if (item && typeof item === 'object') {
              path = item.$ref;
              if (typeof path === 'string' && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(item);
              }
            }
          }
        } else {
          for (name in value) {
            if (typeof value[name] === 'object') {
              item = value[name];
              if (item) {
                path = item.$ref;
                if (typeof path === 'string' && px.test(path)) {
                  value[name] = eval(path);
                } else {
                  rez(item);
                }
              }
            }
          }
        }
      }
    }($));
    return $;
  }

, filepathFromStackIndex: function (i) {
    var path = require('path')
      , origPrepareStackTrace = Error.prepareStackTrace
  
    // Shim our own
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
  
    // Get the call stack
    var stack = new Error().stack
  
    // Restore the original callback
    Error.prepareStackTrace = origPrepareStackTrace

    return stack[i].getFileName()
  }

, htmlEncode: function (html) {
    var tagsToReplace = {
      '&': '&amp;'
    , '<': '&lt;'
    , '>': '&gt;'
    }
    return html.replace(/[&<>]/g, function (tag) {
      return tagsToReplace[tag] || tag;
    })
  }

, htmlDecode: function (html) {
    var tagsToReplace = {
      '&amp;': '&'
    , '&lt;': '<'
    , '&gt;': '>'
    }
    return html.replace(/&lt;|&gt;|&amp;/g, function (tag) {
      return tagsToReplace[tag] || tag;
    })
  }
})
