!function (name, root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root[name] = factory()
}('Sara', this, function () {
  /*!
   *
   * UTILITIES
   *
   */

  Function.prototype.method = function (name, method) {
    if (method) {
      this.prototype[name] = method
      return this
    }
    
    return this.prototype[name]
  }
  
  /*!
   *
   * SARA
   *
   */
  
  function Sara() {
    
  }
  
  /*!
   *
   * RESOURCE
   *
   */
  
  Sara.method('Resource', function (object) {
    
  })
  
  /*!
   *
   * VIEW
   *
   */
  
  Sara.method('View', function (object) {
    
  })
  
  /*!
   *
   * PRESENTER
   *
   */
  
  Sara.method('Presenter', function (object) {
    
  })
  
  /*!
   *
   * ROUTER
   *
   */
  
  Sara.method('Router', function (object) {
    
  })
  
  return Sara
})