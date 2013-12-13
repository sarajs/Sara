/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

// Add a function as a property of an object
exports.add = function add(func) {
	this[func.name] = func
	return this
}

// Copy all of the properties in the source objects over to the destination object
exports.extend = function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
}

// Filters an objects keys by an iterator function
exports.filter = function filter(iterator, context) {
  var results = []
  if (this == null) return results
  this.each(function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value)
  })
  return results
}

// Iterates over an objects keys
exports.each = function each(iterator, context) {
  for (var i = 0, length = this.length; i < length; i++) {
    if (iterator.call(context, this[i], i, this) === {}) return
  }
}

// A prototyping helper
exports.method = function method(method) {
  if (method instanceof Function) {
    if (method.name) {
      this.prototype[method.name] = method
      return this
    }
    throw 'Attempted to prototype anonymous function to ' + this
  }
  return this.prototype[method]
}

// Removes the extension from a file
exports.trimExtension = function trimExtension() {
  return this.replace(/\.[^/.]+$/, '')
}