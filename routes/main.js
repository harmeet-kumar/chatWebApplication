module.exports = (function(){
	// var
	var notices = require('./notices');
	var noticesFile = require('./notices-file');
	var noticesSql = require('./notices-sql');
	var issues = require('./issues');
	var login = require('./login');
	var logout = require('./logout');
	var initR = require('./initR');
	var employees = require('./employees');
	var profile = require('./profile');
	 

	// initialisation of variables

	// decalre functions

	// declare init
	function init(routeConfig){
		notices.init(routeConfig);
		profile.init(routeConfig);
		noticesFile.init(routeConfig);
		noticesSql.init(routeConfig);
		issues.init(routeConfig);
		login.init(routeConfig);
		logout.init(routeConfig);
		initR.init(routeConfig);
		employees.init(routeConfig);
	}

	// return

	return {
		init: init
	}
})();