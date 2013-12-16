var Sara = require('../..')
	, Post = require('../resources/post')
	, Layout = require('layout')

with (Sara) module.exports = Layout.extend({
	initialize: function () {
		console.log("now rendering the posts view!")
	}
, index: new HTML(['p', 'All posts.'])
, show: new HTML(['p', 'A post.'])
, form: new HTML('The form to ')
, edit: new HTML(['p', this.form + 'edit a post.'])
, create: new HTML(['p', this.form + 'create  a post.'])
})