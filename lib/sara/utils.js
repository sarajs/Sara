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
    throw 'Attempted to prototype anonymous function to ' + obj
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
    throw 'Attempted to add anonymous function to ' + obj
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

, decycle: function (object) {
    'use strict';

    // Make a deep copy of an object or array, assuring that there is at most
    // one instance of each object or array in the resulting structure. The
    // duplicate references (which might be forming cycles) are replaced with
    // an object of the form
    //      {$ref: PATH}
    // where the PATH is a JSONPath string that locates the first occurance.
    // So,
    //      var a = [];
    //      a[0] = a;
    //      return JSON.stringify(JSON.decycle(a));
    // produces the string '[{"$ref":"$"}]'.

    // JSONPath is used to locate the unique object. $ indicates the top level of
    // the object or array. [NUMBER] or [STRING] indicates a child member or
    // property.

    var objects = [],   // Keep a reference to each unique object or array
        paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {

      // The derez recurses through the object, producing the deep copy.

      var i,          // The loop counter
          name,       // Property name
          nu;         // The new object or array

      // typeof null === 'object', so go on if this value is really an object but not
      // one of the weird builtin objects.

      if (typeof value === 'object' && value !== null &&
                        !(value instanceof Boolean) &&
                        !(value instanceof Date)    &&
                        !(value instanceof Number)  &&
                        !(value instanceof RegExp)  &&
                        !(value instanceof String)) {

        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a $ref/path object. This is a hard way,
        // linear search that will get slower as the number of unique objects grows.

        for (i = 0; i < objects.length; i += 1) {
          if (objects[i] === value) {
            return {$ref: paths[i]};
          }
        }

        // Otherwise, accumulate the unique value and its path.

        objects.push(value);
        paths.push(path);

        // If it is an array, replicate the array.

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          nu = [];
          for (i = 0; i < value.length; i += 1) {
            nu[i] = derez(value[i], path + '[' + i + ']');
          }
        } else {

          // If it is an object, replicate the object.

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

, retrocycle: function ($) {
    'use strict';

    // Restore an object that was reduced by decycle. Members whose values are
    // objects of the form
    //      {$ref: PATH}
    // are replaced with references to the value found by the PATH. This will
    // restore cycles. The object will be mutated.

    // The eval function is used to locate the values described by a PATH. The
    // root object is kept in a $ variable. A regular expression is used to
    // assure that the PATH is extremely well formed. The regexp contains nested
    // * quantifiers. That has been known to have extremely bad performance
    // problems on some browsers for very long strings. A PATH is expected to be
    // reasonably short. A PATH is allowed to belong to a very restricted subset of
    // Goessner's JSONPath.

    // So,
    //      var s = '[{"$ref":"$"}]';
    //      return JSON.retrocycle(JSON.parse(s));
    // produces an array containing a single element which is the array itself.

    var px =
                /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

    (function rez(value) {

      // The rez function walks recursively through the object looking for $ref
      // properties. When it finds one that has a value that is a path, then it
      // replaces the $ref object with a reference to the value that is found by
      // the path.

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
})