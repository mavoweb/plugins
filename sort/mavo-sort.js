(function() {

Mavo.Plugins.register("sort", {
	init: function() {
		Mavo.Functions.sort = function(array, ...properties) {
			var arrayCopy = array.slice();
			var splitChar = ".";

			arrayCopy.sort(function(prev, next) {
				// TODO: What to do if we get an array of numbers instead of array
				// of objects

				// Sort objects by first property that doesn't result in a tie
				for (var propertyString of properties) {
					// TODO: what to do if empty string?
					var order = propertyString[0];
					// TODO: what to do if order is not + or -
					var propertyString = propertyString.substring(1);
					// TODO: what to do if propertyString is empty string
					// My guess would be that they simply want to sort an array of
					// primitives, like numbers or strings

					var nestedList = propertyString.split(splitChar);
					for (property of nestedList) {
						// TODO: what to do if property doesn't exist? Fail silently?
						prev = prev[property];
						next = next[property];
					}

					// TODO: do we need ordering criterion specific to element type?
					// This should work for numbers and strings, but what to do if
					// unexpected type?
					if ((prev < next && order === "+") ||
							(prev > next && order === "-")) {
						return -1;
					}
					if ((prev > next && order === "+") ||
							(prev < next && order === "-")) {
						return 1;
					}
					// If neither checks work, we have a tie, attempt again with
					// next property
				}

				// If they all result in a tie, return a tie
				return 0;
			});

			return arrayCopy;
		}
	}
});

})();
