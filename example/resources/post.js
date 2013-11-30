var Application = require('../../sara')

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