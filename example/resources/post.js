var Application = require('../..')

module.exports = Application.Resource.extend({
	_name: 'post'
, schema: {
		title: String
	, author: String
	, created: Date
	, updated: Date
	, content: String 
	}
})