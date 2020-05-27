$(document).on('change', '.select', function(e) {
    updateJson('select',e);
});

$("#selectBtn").on("click", function(e) {
	// 判断select部分是否已经生成了selectTemplate
	let selectTemplate = $(".selectBody").find(".selectTemplate");
	if (selectTemplate.length > 0) {
		return;
	}
	// 判断from部分是否已经选择了表
	let selectedTable = $(".fromBody").find("select.selectTable option:selected");
	let flag = false;
	for (let table = 0; table < selectedTable.length; table++) {
		let ttable = selectedTable[table].value;
		if (ttable != "") {
			flag = true;
		}
	}
	if (flag) {
		addSelect(this,e);
	} else {
		alert("请先从from中选择表");
		return;
	}

});

/**
 * 添加selectTemplate
 * @param {Object} e
 */
function addSelect(that, e) {
	let selectTemplate = $(".selectTemplate").clone();
	addSelectOptions(selectTemplate);
	$(selectTemplate).appendTo($(that).siblings(".selectBody")).on('click','.selectAdd',function(e){
		addSelect($("#selectBtn"),e);
	}).on('click','.selectRemove',function(e){
		$(this).closest(".selectTemplateOne").remove();
	});
	selectTemplate.attr("class", "selectTemplateOne");
	selectTemplate.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 给selectTemplate的select框赋值
 * @param {Object} selectTemplate
 */
function addSelectOptions(selectTemplate) {
	let expressionOption = '';
	for (i in expression) {
		expressionOption += '<option value="' + expression[i] + '">' + expression[i] + '</option>';
	}
	let expressionSelect = selectTemplate.find('select.expression');
	expressionSelect.html(expressionOption);
	expressionSelect.selectpicker({
		width: '140px'
	});

	let selectFields = selectTemplate.find("select.selectFields");
	selectedTableNodeInfo.forEach(function(value, key, map) {
		let optgroup = $("<optgroup>").attr("label", key);
		for (let item of value) {
			let option = new Option(item, item);
			optgroup.append(option);
		}
		selectFields.append(optgroup[0]);
	});
	selectFields.selectpicker({
		width: '140px'
	});
}
