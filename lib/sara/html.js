/*!
 *
 * HTML
 *
 */

var _ = require('../utilities')

exports.stringify = function (DJM) {
	var HTML = ''

	_.each.call(DJM, function DJMtoHTML(element) {
		if (_.typeOf(element[0]) === 'string') HTML += '<' + element[0]
		
		if (_.typeOf(element[1]) === 'string') {
			HTML += '>'
			HTML += element[1]
			HTML += '</' + element[0] + '>'
		} else {
			if (_.typeOf(element[1]) === 'object') {
				for (var attribute in element[1]) {
					HTML += (' ' + attribute + '="' + element[1][attribute] + '"')
				}
				
				HTML += '>'
				transverse(element[0], element[2])
				HTML += '</' + element[0] + '>'
			}
			
			transverse(element[0], element[1])
		}
		
		function transverse(element, content) {
			if (_.typeOf(content) === 'array') {
				HTML += '>'
				_.each.call(content, DJMtoHTML)
				HTML += '</' + element + '>'
			}
			
			if (_.typeOf(content) === 'string') HTML += content
		}
	})
	
	return HTML
}