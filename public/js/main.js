(function(){
	// var
	var $bodyContent;
	var $liUser, $liLogout, $liLogin;
	window.admin = false;
	// var init
	$bodyContent = $('#bodyContent');
	$liUser = $('#liUser');
	$liLogout = $('#liLogout');
	$liLogin = $('#liLogin');
	$chatBox = $('#chatBox');

	// functions
	function handleHashChange(){
		switch(window.location.hash){
			case '#notices':
				window.notices.handleHash(injectBodyContent);
				break;
			case '#issues':
				window.issues.handleHash(injectBodyContent);
				break;
			case '#employees':
				window.employees.handleHash(injectBodyContent);
				break;
			case '#login':
				window.login.handleHash(injectBodyContent);
				break;
			case '#profile':
				window.profile.handleHash(injectBodyContent);
				break;
			case '#logout':
				window.logout.handleHash();
				break;
			default: 
				break;
		}
	}

	function injectBodyContent(bodyContentHTML, afterInjectionCB){
		$bodyContent.html(bodyContentHTML);
		if(afterInjectionCB && typeof afterInjectionCB === 'function'){
			afterInjectionCB();
		}
	}

	function getInitData(){
		$.ajax({
			url: '/init',
			method: 'GET',
			data: {
			},
			success: getInitDataSH
		})
	}

	function getInitDataSH(data){
		
		$liUser.addClass('hidden');
		$liLogout.addClass('hidden');
		$liLogin.addClass('hidden');
		$chatBox.addClass('hidden');
		
		if(data.IsAuthenticated){
			$liUser.find('a').html('Hi ' + data.user.UserName);
			$liUser.removeClass('hidden');
			$liLogout.removeClass('hidden');
			$chatBox.removeClass('hidden');
			window.chat.init(data.user.UserName);
				window.admin = data.user.IsAdmin;
			
			window.user = data.user.UserName;
		} else {
			$liLogin.removeClass('hidden');
		}
	}

	// init
	function init(){
		window.notices.init();
		window.profile.init();
		window.issues.init();
		window.employees.init();
		window.login.init();
		window.logout.init();
		


		$(window).on('hashchange', handleHashChange);
		handleHashChange();
		getInitData();
	}

	// init call
	init();
})();