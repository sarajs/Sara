var Application = require('sara')

module.exports = new Application.Resource({
  title: String
, author: String
, created: Date
, updated: Date
, content: String
})
