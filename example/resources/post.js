var Application = require('../..')

module.exports = Application.Resource.extend({
	_name: 'post'
, title: String
, author: String
, created: Date
, updated: Date
, content: String 
})