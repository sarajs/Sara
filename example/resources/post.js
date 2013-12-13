var Application = require('../../index')
  , app = require('../app')

module.exports = Application.Resource.extend({
  name: 'post'
, attributes: {
    title: String
  , author: String
  , created: Date
  , updated: Date
  , content: String 
  }
})