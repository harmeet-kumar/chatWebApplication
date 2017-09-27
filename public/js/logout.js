window.logout = (function(){
	// var
	var parentClosure = {};

	// var init
	
	// functions
	function handleHash(htmlInjector){
		$.ajax({
			url: '/logout',
			method: 'GET',
			dataType: 'text',
			data: {
			},
			success: logoutSH,
			error: function(){
				console.log(arguments);
			}
		});
	}

	function logoutSH(){
		window.chat.removeUser();
		window.location = '';
	}

	// init
	function init(){
	}

	// return
	return {
		init: init,
		handleHash: handleHash
	}
})();