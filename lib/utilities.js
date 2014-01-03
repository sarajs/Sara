/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

// Add a function as a property of an object
exports.add = function add(obj, func) {
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

// A shortcut to logging an object
exports.add(function log(obj) {
  console.log(obj)
})

// Produces a new array of values by mapping each value in list through a transformation function (iterator)
exports.add(function map(iterator) {
  var collection
    , i

  if (Array.isArray(this)) {
    collection = []
    for (i = 0; i < this.length; i++) collection.push(iterator(this[i]))
  } else {
    collection = {}
    for (i in this) collection[i] = iterator(this[i])
  }
    
  return collection
})

// Calls the method named by methodName on each value in the list.
exports.add(function invoke(methodName) {
  return map(this, function(value) {
    return (typeof methodName == 'function' ? methodName : value[methodName]).apply(value)
  })
})

// Copy all of the properties in the source objects over to the destination object
exports.add(function extend(object) {
  for (var prop in object) {
    this[prop] = object[prop]
  }
  return this
})

// Filters an objects keys by an iterator function
exports.add(function filter(iterator, context) {
  var results = []
  if (this == null) return results
  this.each(function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value)
  })
  return results
})

// Iterates over an objects keys
exports.add(function each(iterator, context) {
  for (var i = 0, length = this.length; i < length; i++) {
    if (iterator.call(context, this[i], i, this) === {}) return
  }
})

// A prototyping helper
exports.add(function method(obj, func) {
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
exports.add(function grabExtension() {
  return this.match(/\.[^\/.]+$/, '')[0]
})

// Get the typeof an element with array, null and regexp support
exports.add(function typeOf(object) {
  object = object || this
  if (object instanceof Array) return 'array'
  else if (object === null) return 'null'
  else if (object instanceof RegExp) return 'regexp'
  else return typeof object
})

exports.add(function pluralize(str) {
  var str = str.toLowerCase()
  if (str[str.length - 1] !== 's') str += 's'
  return str
})

exports.add(function first() {
  for (var key in this) return this[key]
})