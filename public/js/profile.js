window.profile = (function(){
	// var
	var parentClosure = {};
    var empId;
	parentClosure.htmlInjector;

	// var init
	
	// functions
	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		parentClosure.htmlInjector = htmlInjector;
		$.ajax({
			url: '/profile',
			method: 'GET',
			dataType: 'json',
			data: {
			},
			success: getDataSH,
			error: function(){
				console.log(arguments);
			}
		});

		
	}

	function getTemplateSH(templateText){
		prepareHTML.templateFunction = Handlebars.compile(templateText);
		prepareHTML();
	}

	function getDataSH(data){
		prepareHTML.data = data;
        parentClosure.data = data;
       
		if(!prepareHTML.templateFunction){
			
				$.ajax({
					url: '/profile-template',
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

	function prepareHTML(){
		if(prepareHTML.data && prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction(prepareHTML.data);
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}


	function saveNotice(){
		var profile = {}, method = 'PUT';
        
        profile.id = parentClosure.data.EmployeeId;
        profile.deptid = parentClosure.data.DepartmentId;
		profile.firstName = parentClosure.txtFirstName.val();
		profile.lastName = parentClosure.txtLastName.val();
        profile.confirmPassword = parentClosure.txtConfirmPassword.val();
		profile.oldPassword = parentClosure.txtOldPassword.val();
		profile.newPassword = parentClosure.txtNewPassword.val();
		profile.department = parentClosure.txtDepartment.val();
        if(profile.firstName!="" && profile.lastName!="")
		{
			if(profile.newPassword === profile.confirmPassword)
			{
				if(profile.firstName !='' && profile.LastName!='')
				{
					if(profile.newPassword=='')
					{
						profile.newPassword = profile.oldPassword;
					}
					if(profile.oldPassword === parentClosure.data.Password){
						$.ajax({
							url: '/profile',
							method: method,
							data: profile,
							success: saveProfileSH
						});
					}
					else
					{
						cancelNotice();
					}
					
				}
				else
				{
					cancelNotice();
				}
				
			}
			else
			{
				cancelNotice();
			}
		}
		else
		{
			alert("Please enter First Name and Last Name");
			cancelNotice();
		}
		
	}
    function cancelNotice()
    {
        parentClosure.txtFirstName.val(parentClosure.data.FirstName);
		parentClosure.txtLastName.val(parentClosure.data.LastName);
		parentClosure.txtOldPassword.val('');
		parentClosure.txtNewPassword.val('');
        parentClosure.txtConfirmPassword.val('');
		parentClosure.txtDepartment.val(parentClosure.data.DepartmentName);
    }

	function saveProfileSH(){
		window.location = '';
	}

	function pageSetup(){
		// variables init
		parentClosure.divProfile = $('#divProfileTemplate #divProfile');
		parentClosure.btnSave = $('#divProfileTemplate #btnSave');
		parentClosure.btnCancel = $('#divProfileTemplate #btnCancel');
		parentClosure.txtOldPassword = $('#divProfileTemplate #txtOldPassword');
		parentClosure.txtConfirmPassword = $('#divProfileTemplate #txtConfirmPassword');
		parentClosure.txtNewPassword = $('#divProfileTemplate #txtNewPassword');
		parentClosure.txtDepartment = $('#divProfileTemplate #txtDepartment');
        parentClosure.txtFirstName = $('#divProfileTemplate #txtFirstName');
        parentClosure.txtLastName = $('#divProfileTemplate #txtLastName');
        parentClosure.txtDepartment.val(parentClosure.data.DepartmentName);
		// events init
		
		parentClosure.btnSave.bind('click', saveNotice);
		parentClosure.btnCancel.bind('click', cancelNotice);
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