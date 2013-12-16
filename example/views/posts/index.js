var Sara = require('../..')
	, Post = require('../resources/post')
	, Layout = require('./layout')

with (Sara) module.exports = new View('Post', {

	layout: Layout

, initialize: function () {
		console.log("Rendering the post index view.")
	}

, html: new HTML(['p', 'All posts.'])

})