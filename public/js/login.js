window.login = (function(){
	// var
	var parentClosure = {};

	// var init
	
	// functions
	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		
		if(!prepareHTML.templateFunction){
			$.ajax({
				url: '/login-template',
				method: 'GET',
				dataType: 'text',
				data: {
				},
				success: getTemplateSH,
				error: function(){
					console.log(arguments);
				}
			});
		} 
	}

	function getTemplateSH(templateText){
		prepareHTML.templateFunction = Handlebars.compile(templateText);
		prepareHTML();
	}

	function prepareHTML(){
		if(prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction({});
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}

	function login(){
		var userId = parentClosure.txtUserId.val();
		var pwd = parentClosure.txtPassword.val();
		if(userId!="" && pwd!="")
		{
			$.ajax({
				url: '/login',
				method: 'POST',
				dataType: 'text',
				data: {
					userId: userId,
					pwd: pwd
				},
				success: loginSH,
				error: function(){
					console.log(arguments);
				}
			});
		}
		else
		{
			alert("Enter Username or Password");
		}
	}

	function loginSH(data){
		
		window.location = '';
		////////////////////////////////////////////////////////////////////////////////////////////
	}

	function pageSetup(){
		// variables init
		parentClosure.txtUserId = $('#divLoginTemplate #txtUserId');
		parentClosure.txtPassword = $('#divLoginTemplate #txtPassword');
		parentClosure.btnLogin = $('#divLoginTemplate #btnLogin');
		
		// events init
		parentClosure.btnLogin.on('click', login);
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