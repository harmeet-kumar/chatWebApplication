window.chat = (function(){
	// var
	var socket;
	var currentUser,parentClosure,myself;
	var selectedUser;
	var allOtherUsers = {};
    

	// var init
	function handleSocketConnect(){
		
		myself = currentUser
	
		document.title = currentUser;

		socket.emit("custom-msg", {
			type: "new-user",
			info: {
				userName: currentUser
			}
		});
	}

	function msgReceived(msgData){
		console.log(allOtherUsers);
		if(msgData.type == 'new-user'){
			if(msgData.info.userName!=currentUser && search(msgData.info.userName)==1)
			{
				$('#chatUl').append('<li user="' + 
				msgData.info.userName + '"><a>' + 
				msgData.info.userName + '</a></li>');
			
				
				allOtherUsers[msgData.info.userName] = [];
			}
			
		} else if(msgData.type == 'existing-users'){
			if(search(currentUser)==1)
			{
				$('#chatUl').empty();
				debugger;
				$('#chatUl').append('<li user="All"><a>All</a></li>');				
				var i = 0;
				for(i = 0; i < msgData.info.length; i++){
					if(msgData.info.userName!=currentUser)
					{
						$('#chatUl').append('<li user="' + 
						msgData.info[i] + '"id='+msgData.info[i]+'"><a>' + 
						msgData.info[i]+ '</a></li>');
					}
					allOtherUsers[msgData.info[i]] = [];
				
				}
			}	
		} 
		else if(msgData.type == 'new-msg'){
			
			console.log(msgData.info.body);
			allOtherUsers[msgData.info.from].push(msgData.info);
			
			xyz = $('#chatUl li').attr('id',msgData.info.from);
			
			xyz.addClass('highlight');
			if(selectedUser == msgData.info.from){
				//$('#left p[user=' + selectedUser + ']').trigger('click');
				 xyz.trigger('click');
			}
			addMsgLi(msgData.info);
		}
		else if(msgData.type==='removeUser')
		{
			console.log(msgData.info.user);
			$('li[user="'+msgData.info.user+'"]').remove();
		}
	}

	function handleUserSelected(){
		
		$(this).removeClass('highlight');
		$('#chatModal').modal('show');

		selectedUser = $(this).html();
		$('#pUserName').html(selectedUser);
		$('#txtMsg').val('');
		$('#listMessages').empty();

		for(i = 0; i < allOtherUsers[selectedUser].length; i++){
			addMsgLi(allOtherUsers[selectedUser][i]);
		}

	}

	function addMsgLi(msgInfo){
		
		var $li = $('<li />');
		$li.html(msgInfo.body);

		if(msgInfo.from == selectedUser){
			$li.addClass('list-group-item list-group-item-info');
			$li.addClass('self');
		} else {
			$li.addClass('list-group-item list-group-item-action list-group-item-warning');
			$li.addClass('other');
		}

		$('#listMessages').append($li);
		$("#listMessages").animate({scrollTop: $('ul#listMessages li:last').offset().top - 100},500);
	}

	function handleMsgSend(){
		var msgData = {
			type: "new-msg",
			info: {
				to: selectedUser,
				from: currentUser,
				body: $('#txtMsg').val()
			}
		};
		socket.emit("custom-msg", msgData);

		allOtherUsers[msgData.info.to].push(msgData.info);
		addMsgLi(msgData.info);
		
		$('#txtMsg').val('');
	}

	// functions
    function search(name)
	{
    	return $('#chatUl li').attr('id',name).length;
	}

	function removeUser()
	{
		var msgData = {
			type: "removeUser",
			info: {
					user: window.user
				}
			};
			socket.emit("custom-msg", msgData);
	}

	// init fn
	function init(data){
		currentUser = data;
		
        socket = io(); // requested connection to io server
	
		socket.on('connect', handleSocketConnect);
		socket.on('custom-msg', msgReceived);

		$('#chatUl').on('click', 'a', handleUserSelected);
		$('#btnSend').on('click', handleMsgSend);

		$(window).on('beforeunload', function(){
			var msgData = {
			type: "delete",
			info: {
					from: currentUser,
				}
			};
			socket.emit("custom-msg", msgData);
		});
		
	}
	

    return {
		init: init,
		removeUser : removeUser 
	}
})();