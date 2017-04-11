(function(){

var readme = $('[property="readme"]');

if (readme) {
	readme.addEventListener("mavo:datachange", function(evt) {
		$$("code", readme).forEach(function(element) {
			Prism.highlightElement(element);
		});
	});
}


})();
