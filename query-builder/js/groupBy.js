$("#groupByBtn").click(function(e) {
	// 判断group by是否以及生成了groupByTemplate
	let groupByTemplate = $(".group-by-body").find(".groupByTemplateOne");
	if (groupByTemplate.length > 0) {
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
		addGroupBy(this, e);
	} else {
		alert("请先从from中选择表");
		return;
	}
});

/**
 * 添加groupByTemplate
 * @param {Object} that
 * @param {Object} e
 */
function addGroupBy(that, e) {
	let groupByTemplate = $(".groupByTemplate").clone();
	addGroupbyOption(groupByTemplate);
	groupByTemplate.attr('class', 'groupByTemplateOne')
	groupByTemplate.show();
	$(groupByTemplate).appendTo($(that).siblings('.group-by-body')).on('click', '.groupbyAdd', function(e) {
		addGroupBy("#groupByBtn", e);
	}).on('click', '.groupbyRemove', function(e) {
		$(this).closest('.groupByTemplateOne').remove();
	});
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 给groupByTemplate模板的select添加option
 * @param {Object} groupByTemplate
 */
function addGroupbyOption(groupByTemplate) {
	let groupByFields = $(groupByTemplate).find("select.groupbyFields");
	selectedTableNodeInfo.forEach(function(value, key, map) {
		let optgroup = $("<optgroup>").attr("label", key);
		for (let item of value) {
			let option = new Option(item, item);
			optgroup.append(option);
		}
		groupByFields.append(optgroup[0]);
	});
	groupByFields.selectpicker({
		width: '140px'
	});
}
