var Application = require('../../sara')
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