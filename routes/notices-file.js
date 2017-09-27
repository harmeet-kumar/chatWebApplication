module.exports = (function(){
	// var
	var fs = require('fs');

	// initialisation of variables

	// decalre functions
	function handleNoticeGet(req, res){
		fs.readFile('data/notices.json', function (err,data) {
			res.send(JSON.parse(data));
		});
	}

	function handleNoticeDelete(req, res){
		var noticeId = parseInt(req.body.id, 10);

		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var idx = -1, i = 0;
			for(i = 0; i < notices.length; i++){
				if(notices[i].id === noticeId){
					idx = i;
					break;
				}
			}

			var notice = notices.splice(idx, 1);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(notice);
			})
		});
	};

	function handleNoticePut(req, res){
		var noticeId = parseInt(req.body.id, 10);

		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var idx = -1, i = 0;
			for(i = 0; i < notices.length; i++){
				if(notices[i].id === noticeId){
					idx = i;
					break;
				}
			}

			var notice = notices.splice(idx, 1, req.body);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(req.body);
			})
		});
	};

	function handleNoticePost(req, res){
		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var notice = {
				title : req.body.title,
				desc: req.body.desc
			};

			if(notices.length > 0){
				notice.id= parseInt(notices[notices.length - 1].id, 10) + 1;
			} else {
				notice.id= 1;
			}

			notices.push(notice);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(notice);
			})
		});
	};	

	// declare init
	function init(routeConfig){
		routeConfig.app.get('/notices-file', handleNoticeGet);
		routeConfig.app.delete('/notices-file', handleNoticeDelete);
		routeConfig.app.put('/notices-file', handleNoticePut);
		routeConfig.app.post('/notices-file', handleNoticePost);
	}

	// return
	return {
		init: init
	}
})();