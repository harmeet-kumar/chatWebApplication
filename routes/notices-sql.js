module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleNoticeTemplate(req, res){
		if(req.userSession.user==null)
		{
			res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'notices-nonadmin.hbs'));
		}else
		{
			if(!req.userSession.user.IsAdmin)
			{
				res.sendFile(
				path.join(
					__dirname, 
					'..\\templates', 
					'notices-nonadmin.hbs'));
			}
			else
			{
				
				res.sendFile(
				path.join(
					__dirname, 
					'..\\templates', 
					'notices.hbs'));
			}
		}
		
	}
	

	function handleNoticeGet(req, res){
		sql.connect(pc.config).then(function(){
			var sqlReqst = new sql.Request();
		    
		    sqlReqst.query('SELECT Notices.*,Convert(varchar(10),StartDate,120) AS xyz,Convert(varchar(10),ExpirationDate,120) AS abc,Employees.FirstName + SPACE(1) + Employees.LastName AS Name FROM [Notices] JOIN Employees ON Notices.PostedBy = Employees.EmployeeId;').then(function(recordsets) {
		        var notices = recordsets.recordset;
				  var toSendNotices = notices.map(function(notice, idx){
		        	return {
		        		id: notice.NoticeId,
		        		title: notice.Title,
		        		desc: notice.Description,
						postedBy: notice.Name,
						startDate: notice.xyz,
						endDate: notice.abc,
						isActive: notice.isActive
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

	function handleNoticeDelete(req, res){
		var noticeId = parseInt(req.body.id, 10);
		sql.connect(pc.config).then(function () {
			var request = new sql.Request().input('id',sql.Int,noticeId);
			request.query("DELETE FROM Notices WHERE NoticeId = @id").then(function (recordsets) {	 
				res.send(req.body);
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
	};

	function handleNoticePut(req, res){
		sql.connect(pc.config).then(function () {
			var id = parseInt(req.body.id,10);
	        var request = new sql.Request().input('title',sql.NVarChar(100),req.body.title);
	        request.input('desc',sql.NVarChar(500),req.body.desc);
	        request.input('id',sql.Int,id);
			request.input('startDate',sql.Date,req.body.startDate);
			request.input('endDate',sql.Date,req.body.endDate);
	        request.query("UPDATE Notices SET Title = @title, Description = @desc,StartDate = @startDate,ExpirationDate = @endDate  OUTPUT INSERTED.* WHERE NoticeID = @id;")
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
	};

	function handleNoticePost(req, res){
		sql.connect(pc.config).then(function () {
	        var request = new sql.Request().input('title',sql.NVarChar,req.body.title);
	        request.input('desc',sql.NVarChar,req.body.desc);
			request.input('postedBy',sql.Int,req.userSession.user.EmployeeId);
			request.input('startDate',sql.Date,req.body.startDate);
			request.input('endDate',sql.Date,req.body.endDate);
			request.input('isActive',sql.Bit,req.body.isActive);
	        request.query("INSERT INTO Notices OUTPUT inserted.* VALUES(@title,@desc,@postedBy,@startDate,@endDate,@isActive)").then(function (recordsets) {	 
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
		
	};	
	function mapSqlToJsObj(sqlObj){
	return {
    			id: sqlObj.NoticeId,
    			title: sqlObj.Title,
    			desc: sqlObj.Description 

    		};
	}

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/notices-template', handleNoticeTemplate);
		
		routeConfig.app.get('/notices-sql', handleNoticeGet);
		routeConfig.app.delete('/notices-sql', handleNoticeDelete);
		routeConfig.app.put('/notices-sql', handleNoticePut);
		routeConfig.app.post('/notices-sql', handleNoticePost);
	}

	// return
	return {
		init: init
	}
})();