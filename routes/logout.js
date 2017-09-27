module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleLogout(req, res){
		req.userSession.IsAuthenticated = false;
		req.userSession.IsAuthorised = false;
		req.userSession.user = null;

		res.send(req.userSession);
	}	

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/logout', handleLogout);
	}

	// return
	return {
		init: init
	}
})();