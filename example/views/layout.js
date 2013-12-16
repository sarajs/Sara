var Sara = require('../..')

with (Sara) module.exports = new View('Layout', {

	initialize: function () {
		console.log('Rendering the layout.')
	}

, html: HTML.stringify([

		["!DOCTYPE html"],
		["html", [
			["head", [
				["meta", { "charset": "utf-8" }],
				["title", "Jackson Gariety"],
				["link", { "href": "/index.css", "rel": "stylesheet", "type": "text/css" }]
			]],
			["body", [
				["header", [
					["h1", "Sara Example"],
					["nav", [
						["a", { "href": "/" }, "Posts"], ["br"],
						["a", { "href": "/posts/new" }, "New Post"]
					]]
				]],
				["main", View.yield]
			]]
		]]
		
	])
	
})