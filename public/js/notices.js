window.notices = (function(){
	// var
	var parentClosure = {};
	parentClosure.htmlInjector;

	// var init
	
	// functions
	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		parentClosure.htmlInjector = htmlInjector;
		$.ajax({
			url: '/notices-sql',
			method: 'GET',
			dataType: 'json',
			data: {
			},
			success: getDataSH,
			error: function(){
				console.log(arguments);
			}
		});
		if(!prepareHTML.templateFunction)
		{
			$.ajax({
				url: '/notices-template',
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
		
	}

	function getTemplateSH(templateText){
		prepareHTML.templateFunction = Handlebars.compile(templateText);
		prepareHTML();
	}

	function getDataSH(data){
		prepareHTML.data = data;
		 prepareHTML();
		
	}

	function prepareHTML(){
		if(prepareHTML.data && prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction(prepareHTML.data);
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}

	function deleteNotice(){
		var noticeId = $(this).closest('div[notice-id]').attr('notice-id');
		console.log(noticeId);
		$.ajax({
			url: '/notices-sql',
			method: 'DELETE',
			data: {
				id: noticeId
			},
			success: deleteNoticeSH
		})
	}

	function deleteNoticeSH(data){
		parentClosure.divNotices.find('div[notice-id=' + data.id + ']').remove();
		handleHash(parentClosure.htmlInjector);
	}

	function editNotice(){
		var noticeTitle, noticeDesc;

		clearModal();

		noticeTitle = $(this).closest('div[notice-id]').find('[info=title]').html();
		noticeDesc = $(this).closest('div[notice-id]').find('[info=desc]').html();
		noticeStartDate = $(this).closest('div[notice-id]').find('[info=startDate]').attr('value');
		noticeEndDate = $(this).closest('div[notice-id]').find('[info=endDate]').attr('value');


		parentClosure.txtNoticeTitle.val(noticeTitle);
		parentClosure.txtDescription.val(noticeDesc);
		
		parentClosure.txtStartDate.val(noticeStartDate);
		parentClosure.txtEndDate.val(noticeEndDate);

		parentClosure.noticeModal.attr('notice-id', $(this).closest('div[notice-id]').attr('notice-id'));

		parentClosure.noticeModal.modal('show');
	}

	function createNotice(){
		clearModal();
		parentClosure.noticeModal.attr('notice-id', '-1');
		parentClosure.noticeModal.modal('show');

	}

	function clearModal(){
		parentClosure.txtNoticeTitle.val('');
		parentClosure.txtDescription.val('');
		parentClosure.txtStartDate.val('');
		parentClosure.txtEndDate.val('');
	}

	function saveNotice(){
		var notice = {}, method = 'POST';

		notice.id = parseInt(parentClosure.noticeModal.attr('notice-id'), 10);
		notice.title = parentClosure.txtNoticeTitle.val();
		notice.desc = parentClosure.txtDescription.val();
		notice.isActive = 1;
		notice.startDate = parentClosure.txtStartDate.val();
		notice.endDate = parentClosure.txtEndDate.val();
		if(notice.title!="" && notice.desc!="" && notice.startDate<notice.endDate)
		{
			if(notice.id != -1){
				method = 'PUT';
				}
				console.log(method);
				$.ajax({
					url: '/notices-sql',
					method: method,
					data: notice,
					success: saveNoticeSH
			});

			parentClosure.noticeModal.modal('hide');
		}
		else
		{
			alert("Please enter valid entries");
		}
		
	}

	function saveNoticeSH(){
		location.reload();
	}

	function pageSetup(){
		// variables init
		parentClosure.divNotices = $('#divNoticesTemplate #divNotices');
		parentClosure.noticeModal = $('#divNoticesTemplate #noticeModal');
		parentClosure.modalTitle = $('#divNoticesTemplate #modalTitle');
		parentClosure.btnSave = $('#divNoticesTemplate #btnSave');
		parentClosure.btnCreate = $('#divNoticesTemplate #btnCreate');
		parentClosure.txtNoticeTitle = $('#divNoticesTemplate #txtNoticeTitle');
		parentClosure.txtDescription = $('#divNoticesTemplate #txtDescription');
		parentClosure.txtStartDate = $('#divNoticesTemplate #txtStartDate');
		parentClosure.txtEndDate = $('#divNoticesTemplate #txtEndDate');

		// events init
		parentClosure.divNotices.on('click', 
			'a[action=delete]', deleteNotice);
		parentClosure.divNotices.on('click', 
			'a[action=edit]', editNotice);
		parentClosure.btnSave.bind('click', saveNotice);
		parentClosure.btnCreate.bind('click', createNotice);
	}

	// init
	function init(data){
		parentClosure.isAdmin = data;
	}

	// return
	return {
		init: init,
		handleHash: handleHash
	}
})();