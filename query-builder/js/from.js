$(document).on('change', '.from', function(e) {
    updateJson('from', e);
});

$("#fromBtn").click(function(e) {
	// 判断左侧是否已选择表
	let checkTableIsSelected = selectedTables.size > 0 ? true : false;
	if (checkTableIsSelected) {
		// 判断是否已经点击过form
		let fromTemplateOneList = $(".fromBody").children(".fromTemplateOnee");
		if (fromTemplateOneList.length > 0) {
			return false;
		}
		addFrom(this,e);
	} else {
		alert("请选择左侧表");
	}
});

/**
 * 添加from选项
 * @param {Object} that
 * @param {Object} e
 */
function addFrom(that, e) {
	let fromTemplateOne = $(".fromTemplateOne").clone();
	addFromOptions(fromTemplateOne);
	$(fromTemplateOne).appendTo($(that).siblings(".fromBody")).on('click','.addJoinBtn',function(e){
		addJoin($("#fromBtn"),e);
	}).on('click','.removeJoinBtn',function(e){
		$(this).closest(".fromTemplateOnee").remove();
		updateJson('from', e);
	});
	fromTemplateOne.attr("class", "fromTemplateOnee frmTemp");
	fromTemplateOne.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 给selectTable赋值
 * @param {Object} fromTemplate
 */
function addFromOptions(fromTemplate) {
	let option = '<option value="">请选择</option>';
	for (let i of selectedTables) {
		option += '<option value="' + i + '">' + i + '</option>'
	}
	let selectTable = $(fromTemplate).find('select.selectTable');

	selectTable.html(option);
	selectTable.selectpicker({
		width: '120px'
	});
}

// 动态绑定点击join事件（因为join是动态生成的）
function addJoin(that, e) {
	let fromTemplateTwo = $(".fromTemplateTwo").clone();
	// 添加option
	addJoinOptions(fromTemplateTwo);
	$(fromTemplateTwo).appendTo($(that).siblings(".fromBody")).on('click','.removeJoinBtnTwo',function(e){
		$(this).closest(".fromTemplateTwoo").remove();
		updateJson('from', e);
	}).on('click','.addJoinBtn',function(e){
		addJoin($('#fromBtn'), e);
	});
	fromTemplateTwo.attr("class", "fromTemplateTwoo frmTemp");
	fromTemplateTwo.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 添加option到fromTemplate
 * @param {Object} fromTemplate
 */
function addJoinOptions(fromTemplate) {
	//join选项
	let joinOption = '<option value="">请选择</option>';
	for (i in joins) {
		joinOption += '<option>' + joins[i] + '</option>'
	}
	let join = $(fromTemplate).find('select.join');
	join.html(joinOption);
	join.selectpicker({
		width: '120px'
	});
	//字段选项
	//$(fromTemplate).find('select.fieldsOne').html(selectedTableTree);
	fieldsSelectpicker(fromTemplate);
	//关系运算符选项
	let comparisonOption = '<option value="">请选择</option>';
	for (i in comparisons) {
		comparisonOption += '<option>' + comparisons[i] + '</option>'
	}
	let comparisonsSelect = $(fromTemplate).find('select.comparisons');
	comparisonsSelect.html(comparisonOption);
	comparisonsSelect.selectpicker({
		width: '100px'
	});
	addFromOptions(fromTemplate);
}

/**
 * 为字段选项赋值
 * @param {Object} fromTemplate
 */
function fieldsSelectpicker(fromTemplate) {
	let fieldsOne = $(fromTemplate).find('select.fieldsOne');
	let fieldsTwo = $(fromTemplate).find('select.fieldsTwo');
	selectedTableNodeInfo.forEach(function(value, key, map) {
		let optgroup = $("<optgroup>").attr("label", key);
		for (let item of value) {
			let option = new Option(item, item);
			optgroup.append(option);
		}
		fieldsOne.append(optgroup[0]);
		fieldsTwo.append($(optgroup).clone());

	});
	fieldsOne.selectpicker({
		width: '140px'
	});
	fieldsTwo.selectpicker({
		width: '140px'
	});
}
