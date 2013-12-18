/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */
 
module.exports = function log(obj) {
  console.log(obj)
}

// Add a function as a property of an object
module.exports.add = function add(obj, func) {
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

// Copy all of the properties in the source objects over to the destination object
module.exports.add(function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
})

// Filters an objects keys by an iterator function
module.exports.add(function filter(iterator, context) {
  var results = []
  if (this == null) return results
  this.each(function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value)
  })
  return results
})

// Iterates over an objects keys
module.exports.add(function each(iterator, context) {
  for (var i = 0, length = this.length; i < length; i++) {
    if (iterator.call(context, this[i], i, this) === {}) return
  }
})

// A prototyping helper
module.exports.add(function method(obj, func) {
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
})

// Removes the extension from a file
module.exports.add(function trimExtension() {
  return this.replace(/\.[^\/.]+$/, '')
})

// Get the typeof an element with array, null and regexp support
module.exports.add(function typeOf(object) {
	var object = object || this
  if (object instanceof Array) return 'array'
  else if (object === null) return 'null'
  else if (object instanceof RegExp) return 'regexp'
  else return typeof object
})

module.exports.add(function pluralize() {
  var str = this.toLowerCase()
  if (str[str.length - 1] !== 's') str += 's'
  return str
})

module.exports.add(function first() {
  for (var key in this) return this[key]
})