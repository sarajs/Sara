var Application = require('../..')

module.exports = Application.View.extend({
	layout: [
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
						["a", { "href": "/" }, ["Posts"]],
						["a", { "href": "/posts/new" }, ["New Post"]]
					]]
				]],
				["main", Application.View.yield]
			]]
		]]
	]
})