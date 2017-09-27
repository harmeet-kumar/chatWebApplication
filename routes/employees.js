module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var date = require('date-and-time');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleEmployeeTemplate(req, res){
		if(!req.userSession.user.IsAdmin)
		{
			res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'employees.hbs'));
		}
		else
		{
			res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'employees-ad.hbs'));
		}
	}
	function handleEmployeeTableTemplate(req, res){

		if(!req.userSession.user.IsAdmin)
		{
			res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'employee-nonadmin.hbs'));
		}
		else
		{
			res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'employee-admin.hbs'));
		}
	}
	


	function handleEmployeeGet(req, res){
		
		sql.connect(pc.config).then(function(){
			var sqlReqst = new sql.Request();
	        sqlReqst.input('first',sql.NVarChar,req.query.employee.firstName);
	        sqlReqst.input('last',sql.NVarChar,req.query.employee.lastName);
	        sqlReqst.input('sd',sql.Date,req.query.employee.startDate ===""?null:req.query.employee.startDate);
	        sqlReqst.input('ed',sql.Date,req.query.employee.endDate===""?null:req.query.employee.endDate);
			sqlReqst.input('deptid',sql.Int,req.query.employee.department);
		    sqlReqst.query('SELECT Employees.*,Departments.DepartmentName,Convert(varchar(10),DateOfJoining,120) AS xyz,Convert(varchar(10),TerminationDate,120) AS abc FROM [Employees] Join [Departments] on Employees.DepartmentId=Departments.DepartmentId Where Employees.FirstName LIKE @first OR Employees.LastName LIKE @last OR (@sd IS NOT NULL AND Employees.DateOfJoining >= @sd) OR (@ed IS NOT NULL AND Employees.TerminationDate <= @ed) OR Employees.DepartmentId LIKE @deptid;')
			.then(function(recordsets) {
		        var employees = recordsets.recordset;
				console.log(recordsets.recordset);
		        var toSendNotices = employees.map(function(employee, idx){
		        	return {
		        		firstName: employee.FirstName,
		        		lastName: employee.LastName,
		        		email: employee.Email,
						DOJ: employee.xyz,
						DOE: employee.abc,
						Dept: employee.DepartmentName,
						EmployeeId: employee.EmployeeId
		        	};
		        });

		        sql.close();
		        res.send(toSendNotices);
		    }).catch(function(err) {
		    	console.log(err);
		    });
		}).catch(function(err) {
		    console.log(err);
		});
	}	

	function handleEmployeeSearch(req,res)
	{
		sql.connect(pc.config).then(function(){
			var sqlReqst = new sql.Request();
		    
		    sqlReqst.query('SELECT * FROM [Employees];').then(function(recordsets) {
		        var notices = recordsets.recordset;
		        var toSendNotices = notices.map(function(notice, idx){
		        	return {
		        		firstName: notice.FirstName,
		        		lastName: notice.LastName,
		        		email: notice.Email,
						DOJ: notice.DateOfJoining,
						DOE: notice.TerminationDate,
						Dept: notice.Department
		        	};
		        });

		        sql.close();
		        res.send(toSendNotices);
		    }).catch(function(err) {
		    	console.log(err);
		    });
		}).catch(function(err) {
		    console.log(err);
		});
	}

	function handleEmployeePost(req, res){
		
		 sql.connect(pc.config).then(function () {
			var request = new sql.Request().input('first',sql.NVarChar,req.body.employee.firstName);
			request.input('last',sql.NVarChar,req.body.employee.lastName);
			request.input('startDate',sql.Date,req.body.employee.startDate===""?null:req.body.employee.startDate);
			request.input('deptname',sql.NVarChar,req.body.employee.departmentName);
			request.input('endDate',sql.Date,req.body.employee.endDate===""?null:req.body.employee.endDate);
			request.input('email',sql.NVarChar,req.body.employee.email);
			request.input('password',sql.NVarChar,req.body.employee.password);
			request.input('dept',sql.Int,req.body.employee.department);
			request.input('isAdmin',sql.Int,req.body.employee.isAdmin);
			request.query("INSERT INTO Employees OUTPUT inserted.* VALUES(@first,@last,@email,@startDate,@endDate,@dept); INSERT INTO Users(EmployeeId,Password,IsAdmin) OUTPUT inserted.* VALUES((SELECT EmployeeId from Employees WHERE Email = @email),@password,@isAdmin);")
			.then(function (recordsets) {	 
				var result = (recordsets.recordset[0]);
					
				res.send(result);
				sql.close();
			})
			.catch(function (err) {
				console.log(err);
				sql.close();
			});        
		})
		.catch(function (err) {
			console.log(err);
		}); 
		//
	};

	function updateUser(req,res)
	{
	
		sql.connect(pc.config).then(function () {
		        var request = new sql.Request().input('first',sql.NVarChar,req.body.employee.firstName);
			request.input('last',sql.NVarChar,req.body.employee.lastName);
			request.input('startDate',sql.Date,req.body.employee.startDate===""?null:req.body.employee.startDate);
			request.input('endDate',sql.Date,req.body.employee.endDate===""?null:req.body.employee.endDate);
			request.input('email',sql.NVarChar,req.body.employee.email);
			request.input('password',sql.NVarChar,req.body.employee.password);
			request.input('dept',sql.Int,req.body.employee.department);
			request.input('isAdmin',sql.Int,req.body.employee.isAdmin);
			request.input('id',sql.Int,req.body.employeeId);
		        request.query("UPDATE Employees SET FirstName = @first, LastName = @last, Email = @email,DateOfJoining=@startDate,TerminationDate=@endDate,DepartmentId=@dept OUTPUT INSERTED.* WHERE EmployeeId = @id;UPDATE Users SET Password = @password, IsAdmin = @isAdmin OUTPUT INSERTED.* WHERE EmployeeId = (SELECT EmployeeId from Employees WHERE Email = @email); ")
		        .then(function (recordsets) {	 
		        	var result = (recordsets.recordset[0]);
		         	
		            res.send(result);
		            sql.close();
		        })
		        .catch(function (err) {
		            console.log(err);
		            sql.close();
		        });        
		    })
		    .catch(function (err) {
		        console.log(err);
		    });
	}

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/employees-template', handleEmployeeTemplate);
		routeConfig.app.get('/employees', handleEmployeeSearch);
		routeConfig.app.get('/employee-Search',handleEmployeeGet);
		routeConfig.app.get('/employee-table',handleEmployeeTableTemplate);
		routeConfig.app.post('/employee-Create',handleEmployeePost);
		routeConfig.app.put('/employee-Edit',updateUser);
	}

	// return
	return {
		init: init
	}
})();