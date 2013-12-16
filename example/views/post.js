var Application = require('../..')
	, Post = require('../resources/post')
	, Layout = require('layout')

module.exports = Layout.extend({
	initialize: function () {
		console.log("now rendering the posts view!")
	}
, index: ['p', 'All posts.']
, show: ['p', 'A post.']
, form: 'The form to '
, edit: ['p', this.form + 'edit a post.']
, create: ['p', this.form + 'create  a post.']
})