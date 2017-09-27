module.exports = (function(){
	// var
	var notices;

	// initialisation of variables
	notices = [{
		id: 1,
		title: 'notice 1',
		desc: 'I am first notice'
	}, {
		id: 2,
		title: 'notice 2',
		desc: 'I am second notice'
	}, {
		id: 3,
		title: 'notice 3',
		desc: 'I am third notice'
	}];

	// decalre functions
	function handleNoticeGet(req, res){
		res.send(global.notices);
	}

	function handleNoticeDelete(req, res){
		var noticeId = parseInt(req.body.id, 10);

		var idx = -1, i = 0;
		for(i = 0; i < global.notices.length; i++){
			if(global.notices[i].id === noticeId){
				idx = i;
				break;
			}
		}

		var notice = global.notices.splice(idx, 1);
		res.send(notice);
	};

	function handleNoticePut(req, res){
		var noticeId = parseInt(req.body.id, 10);

		var idx = -1, i = 0;
		for(i = 0; i < global.notices.length; i++){
			if(global.notices[i].id === noticeId){
				idx = i;
				break;
			}
		}

		global.notices[idx].title = req.body.title;
		global.notices[idx].desc = req.body.desc;

		res.send(req.body);
	};

	function handleNoticePost(req, res){
		var notice = {
			id: global.notices[global.notices.length - 1].id + 1,
			title : req.body.title,
			desc: req.body.desc
		};

		global.notices.push(notice);
		res.send(notice);
	};	

	// declare init
	function init(routeConfig){
		routeConfig.app.get('/notices', handleNoticeGet);
		routeConfig.app.delete('/notices', handleNoticeDelete);
		routeConfig.app.put('/notices', handleNoticePut);
		routeConfig.app.post('/notices', handleNoticePost);
	}

	// return
	return {
		init: init
	}
})();