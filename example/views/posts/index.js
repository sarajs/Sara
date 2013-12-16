var Sara = require('../../..')
	, Post = require('../../models/post')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Post', {

	layout: Layout

, initialize: function () {
		console.log("Rendering the post index view.")
	}

, html: HTML.stringify(['p', 'All posts.'])

})