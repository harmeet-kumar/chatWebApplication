window.employees = (function(){
	// var
	var parentClosure = {};
	var forModal = {};

	// var init
	
	// functions

	function deptnum(num)
	{
		switch(num){
			case 'Administration':
				return 1;
			case 'Finance':
				return 2;
			case 'HR':
				return 3;
			case 'Engineering':
				return 4;
			case 'IT':
				return 5;
			case 'Marketing':
				return 6;
		}

	}

	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		parentClosure.htmlInjector = htmlInjector;
		$.ajax({
			url: '/employees',
			method: 'GET',
			dataType: 'json',
			data: {
			},
			success: getDataSH,
			error: function(){
				console.log(arguments);
			}
		});
		
		
			$.ajax({
				url: '/employees-template',
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

	function getTemplateSH(templateText){
		
		prepareHTML.templateFunction = Handlebars.compile(templateText);
		prepareHTML();
	}

	function getDataSH(data){
		if(data.IsAuthenticated === false){
			var html = 'Please <a href="#login">Login</a> to access employees';
			prepareHTML.htmlInjector(html, null);
		} else if(data.IsAuthorised === false){
			var html = 'Please <a href="#logout">Logout</a> and Login with proper role to access employees';
			prepareHTML.htmlInjector(html, pageSetup);
		}
		else {
			prepareHTML.data = data;
			prepareHTML();
		}
	}

	function prepareHTML(){
		if(prepareHTML.data && prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction(prepareHTML.data);
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}


	function searchEmployees()
	{
		var employee = {};
		employee.firstName = parentClosure.txtFirstName.val();
		employee.lastName = parentClosure.txtLastName.val();
		employee.email = parentClosure.txtEmail.val();
		employee.startDate = parentClosure.txtStartDate.val();
		employee.endDate = parentClosure.txtEndDate.val();
		employee.department = deptnum(parentClosure.selectDep.val());
		

		$.ajax({
			url: '/employee-Search',
			method: 'GET',
			dataType: 'json',
			data: {
				employee
			},
			success: getDataSH,
			error: function(){
				console.log(arguments);
			}
		});
		
		
			$.ajax({
				url: '/employee-table',
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

	function openModal()
	{
		parentClosure.editkarna = false;
		forModal.modal.modal('show');
	}

	function createEmployee()
	{



		var employee = {};
		employee.firstName = forModal.txtFirstName.val();
		employee.lastName = forModal.txtLastName.val();
		employee.startDate = forModal.txtStartDate.val();
		employee.endDate = forModal.txtEndDate.val();
		employee.department = deptnum(forModal.txtDepartment.val());
		employee.departmentName = forModal.txtDepartment.val();
		employee.email = forModal.txtEmail.val();
		employee.isAdmin = forModal.checkIsAdmin.val();
		employee.password = forModal.txtPassword.val();
		employee.employeeId = forModal.employeeId;
		console.log(employee);
		
		if(employee.firstName!=""&&employee.lastName!=""&&employee.startDate!=""&&employee.email!=""&&employee.password!="")
		{
			if(parentClosure.editkarna)
			{
				$.ajax({
					url: '/employee-Edit',
					method: 'PUT',
					dataType: 'json',
					data: {
						employee
					},
					success: getDataSH,
					error: function(){
						console.log(arguments);
					}
				});
				parentClosure.editkarna = false;
			}
			else
			{
				$.ajax({
					url: '/employee-Create',
					method: 'POST',
					dataType: 'json',
					data: {
						employee
					},
					success: getDataSH,
					error: function(){
						console.log(arguments);
					}
				});
			}

			forModal.txtFirstName.val('');
			forModal.txtLastName.val('');
			forModal.txtStartDate.val('');
			forModal.txtEndDate.val('');
			forModal.txtEmail.val('');
			forModal.txtPassword.val('');
			
			forModal.modal.modal('hide');
		}
		else
		{
			alert("Enter Valid Details");
			if(parentClosure.editEmployee)
			{
				editEmployee();
			}
			else
			{
				forModal.txtFirstName.val('');
				forModal.txtLastName.val('');
				forModal.txtStartDate.val('');
				forModal.txtEndDate.val('');
				forModal.txtEmail.val('');
				forModal.txtPassword.val('');
			}
		}		
	}

	function editEmployee()
	{
		parentClosure.editkarna = true;

		forModal.txtFirstName.val($(this).closest('tr[EmployeeId]').find('[info=firstName]').html());
		forModal.txtLastName.val($(this).closest('tr[EmployeeId]').find('[info=lastName]').html());
		forModal.txtStartDate.val($(this).closest('tr[EmployeeId]').find('[info=DOJ]').html());
		forModal.txtDepartment.val($(this).closest('tr[EmployeeId]').find('[info=Dept]').html());
		forModal.txtEmail.val($(this).closest('tr[EmployeeId]').find('[info=email]').html());
		forModal.txtPassword.val('');
		forModal.employeeId = $(this).closest('tr[EmployeeId]').attr('EmployeeId');
		
		forModal.modal.modal('show');
	}


	

	function pageSetup(){
		// variables init
		//common
		parentClosure.isAdmin = window.admin;
		

		parentClosure.editkarna = true;

		parentClosure.divEmployees =  $('#divEmployeeTemplate');
		parentClosure.txtFirstName = $('#divEmployeeTemplate #txtFirstName');
		parentClosure.txtLastName = $('#divEmployeeTemplate #txtLastName');
		parentClosure.txtEmail = $('#divEmployeeTemplate #txtEmail');
		parentClosure.txtStartDate = $('#divEmployeeTemplate #txtStartDate');
		parentClosure.txtEndDate = $('#divEmployeeTemplate #txtEndDate');
		parentClosure.selectDep = $('#divEmployeeTemplate #selectDep');
		parentClosure.btnSearch = $('#divEmployeeTemplate #btnSearch');
		//admin

		parentClosure.btnCreate = $('#divEmployeeTemplate #btnCreate');
		
		forModal.modal = $('#employeeModal');
		forModal.btnSave = $('#employeeModal #btnSave');
		forModal.txtFirstName = $('#employeeModal #txtFirstName');
		forModal.txtLastName = $('#employeeModal #txtLastName');
		forModal.txtEmail = $('#employeeModal #txtEmail');
		forModal.txtStartDate = $('#employeeModal #txtStartDate');
		forModal.txtEndDate = $('#employeeModal #txtEndDate');
		forModal.txtDepartment = $('#employeeModal #txtDepartment');
		forModal.txtPassword = $('#employeeModal #txtPassword');
		forModal.checkIsAdmin = $('#employeeModal #checkIsAdmin');




		// events init

		parentClosure.divEmployees.on('click', 'button[action=edit]', editEmployee);

		parentClosure.btnSearch.on('click',searchEmployees);
		parentClosure.btnCreate.on('click',openModal);
		forModal.btnSave.on('click',createEmployee);
		

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