/**
 * jQuery plugin for generating the outer html of an element.
 * The outer html can be indented with tabs appropriately, if specified.
 * 
 * @requires innerxhtml
 *
 * @author Mirza Busatlic
 * @url http://github.com/mirzabusatlic/jquery-outer-html
 */
(function($) {
	
	/**
	 * List of self-closing tags.
	 */
	var selfClosingTags = [
		"area", "base", "br", "col", "command", "embed", 
		"hr", "img", "input", "keygen", "link", "meta", 
		"param", "source", "track", "wbr"
	];
	
	$.fn.outerHtml = function(options) {
		
		var defaults = {
			// If specified, indent the hierarchy by appending tabs and new lines.
			indent: false
		}
		
		var settings = $.extend(defaults, options);
		
		var $this = $(this);
		
		if(settings.indent) {
			return indentChildren($this);
		} else {
			// Wrap with fake wrapper so calling the innerhtml will return the whole block.
			var $fakeWrapper = $("<fake>");
			$fakeWrapper.append($this);
			// Get the inner xhtml.
			var code = innerXHTML($fakeWrapper.get(0));
			// Remove self-closing tags.
			$.each(selfClosingTags, function(index, tag) {
				var pattern = "</" + tag + ">";
				code = code.replace(new RegExp(pattern, "g"), "");
			});
			// Return the code.
			return code;
		}
	};
	
	/**
	 * Indent the element and all of its children.
	 * @param {object} $element
	 * @returns {string} Fully tabbed string representation of the element hierarchy.
	 */
	function indentChildren($element) {
		// Get all of the children of the specified element.
		var $children = $element.find("*");
		// Iterate each child and 
		$children.each(function(index, child) {
			var $child = $(child);
			$child = indent($child);
		});
		// Perform indent on the element itself (the root).
		$element = indent($element, false);
		return $element.outerHtml(false);
	}
	
	/**
	 * Indent the specified element.
	 * @param {object} $element
	 * @returns
	 */
	function indent($element) {
		// Calculate the depth.
		var depth = $element.parents().length;
		// Wrap the element with a fake element.
		$element.wrap($("<indent>"));
		// Generate the indent string.
		var indentValues = getIndentValues($element, depth);
		// Prepand and append the indent strings.
		$element.before(indentValues.before);
		$element.append(indentValues.after);
		// Unwrap the fake element.
		$element.unwrap("indent");
		// Return the element.
		return $element;
	};

	/**
	 * Get the before & after indent values for the element.
	 * @param {object} $element
	 * @param {int} tabs The number of tabs
	 * @returns {string}
	 */
	function getIndentValues($element, tabs) {
		// Generate tabs string.
		var indent = "";
		for(var i = 0; i < tabs; i++) {
			indent += "\t";
		}
		// Generate before & after values.
		var newLine = "\r\n";
		var before = newLine + indent;
		var after = $element.children().length > 0 ? newLine + indent : "";
		// Return the before & after values.
		return {before: before, after: after};
	};
	
})(jQuery);
