var Sara = require('../..')

with (Sara) module.exports = new Model('Post', {

	'title': String
, 'author': String
, 'created': Date
, 'updated': Date
, 'content': String 

})