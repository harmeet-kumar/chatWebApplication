module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleProfileTemplate(req, res){
		res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'profile.hbs'));
	}
	

	function handleProfileGet(req, res){
		sql.connect(pc.config).then(function(){
			var sqlReqst = new sql.Request();
		    sqlReqst.input('id',sql.Int,req.userSession.user.EmployeeId);
		    sqlReqst.query('Select Employees.EmployeeId,Employees.FirstName,Employees.LastName,Departments.DepartmentName,Departments.DepartmentId,Users.Password From Employees JOIN Users On Users.EmployeeId = Employees.EmployeeId Join Departments On Employees.DepartmentId = Departments.DepartmentId WHERE Employees.EmployeeId = @id;')
            .then(function(recordsets) {
                var profile = recordsets.recordset[0];
		        sql.close();
		        res.send(profile);
		    }).catch(function(err) {
		    	console.log(err);
		    });
		}).catch(function(err) {
		    console.log(err);
		});
	};

	function handleProfilePut(req, res){
		sql.connect(pc.config).then(function () {
			var id = parseInt(req.body.id,10);
	        var request = new sql.Request().input('firstname',sql.NVarChar,req.body.firstName);
	        request.input('lastname',sql.NVarChar,req.body.lastName);
	        request.input('id',sql.Int,id);
            request.input('deptid',sql.Int,id);
            request.input('pwd',sql.NVarChar,req.body.newPassword);
            request.input('department',sql.NVarChar,req.body.department);
			request.query("UPDATE Employees SET FirstName = @firstname, LastName = @lastname, DepartmentId = (SELECT DepartmentId FROM Departments Where DepartmentName=@department) OUTPUT INSERTED.* WHERE EmployeeId = @id; UPDATE Users SET Password = @pwd OUTPUT INSERTED.* WHERE EmployeeId = @id;")
	        .then(function (recordsets) {	 
				var result = (recordsets.recordset[0]);
	            res.send(result);
	            sql.close();
	        })
	        .catch(function (err) {
	            console.log(err);
	            sql.close();
	        });        
	    }).catch(function(err) {
		    console.log(err);
		});   
	};

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/profile-template', handleProfileTemplate);
		routeConfig.app.get('/profile', handleProfileGet);
		routeConfig.app.put('/profile', handleProfilePut);
	}

	// return
	return {
		init: init
	}
})();