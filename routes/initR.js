module.exports = (function(){
	// var

	// initialisation of variables

	// decalre functions
	function handleNoticeGet(req, res){
		res.send(req.userSession);
	}

	// declare init
	function init(routeConfig){
		routeConfig.app.get('/init', handleNoticeGet);
	}

	// return
	return {
		init: init
	}
})();