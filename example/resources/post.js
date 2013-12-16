var Sara = require('../..')

with (Sara) module.exports = Resource.extend({
	_name: 'post'
, schema: {
		title: String
	, author: String
	, created: Date
	, updated: Date
	, content: String 
	}
})