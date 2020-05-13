$("#havngBtn").click(function(e) {
	// 判断having是否以及生成了havingTemplate
	let havingTemplate = $(".havingBody").find(".havingTemplateOnee");
	if (havingTemplate.length > 0) {
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
		addHaving(this, e);
	} else {
		alert("请先从from中选择表");
		return;
	}
});

/**
 * 添加havingTemplate模板
 * @param {Object} that
 * @param {Object} e
 */
function addHaving(that, e) {
	let havingTemplate = $(".havingTemplateOne").clone();
	addHavingOption(havingTemplate);
	$(havingTemplate).appendTo($(that).siblings('.havingBody')).on('click', '.addConditionHaving', function(e) {
		addConditionHaving(this, e);
	}).on('click', '.addGroupHaving', function(e) {
		addHaving(this, e);
	}).on('click', '.removeGroupHaving', function(e) {
		removeGroupHaving(this, e);
	});
	havingTemplate.attr('class', 'havingTemplateOnee');
	havingTemplate.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 为havingTemplate添加模板
 * @param {Object} havingTemplate
 */
function addHavingOption(havingTemplate) {
	var option = '';
	for (i in logicalOperators) {
		option += '<option value="' + logicalOperators[i] + '">' + logicalOperators[i] + '</option>'
	}
	let havingSelect = $(havingTemplate).find('select.logicalOperators');
	havingSelect.html(option);
	havingSelect.selectpicker({
		width: '100px'
	});
}

/**
 * addConditionHaving点击事件
 * @param {Object} that
 * @param {Object} e
 */
function addConditionHaving(that, e) {
	let havingTemplateTwo = $(".havingTemplateTwo").clone();
	addConditioHavingOption(havingTemplateTwo);
	$(havingTemplateTwo).appendTo($(that).siblings('.havingBody')).on('click', '.removeConditionHaving', function(e) {
		removeConditionHaving(this, e);
	})
	havingTemplateTwo.attr('class', 'havingTemplateTwoo');
	havingTemplateTwo.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 为havingTemplateTwo模板select添加option
 * @param {Object} havingTemplateTwo
 */
function addConditioHavingOption(havingTemplateTwo) {
	var expressionOption = '';
	for (i in expression) {
		expressionOption += '<option value="' + expression[i] + '">' + expression[i] + '</option>'
	}
	let expressionSelect = $(havingTemplateTwo).find('select.expression');
	expressionSelect.html(expressionOption);
	expressionSelect.selectpicker({
		width: '100px'
	});
	let fieldsSelect = $(havingTemplateTwo).find("select.fields");
	selectedTableNodeInfo.forEach(function(value, key, map) {
		let optgroup = $("<optgroup>").attr("label", key);
		for (let item of value) {
			let option = new Option(item, item);
			optgroup.append(option);
		}
		fieldsSelect.append(optgroup[0]);
	});
	fieldsSelect.selectpicker({
		width: '140px'
	});
	var comparisonsOption = '';
	for (i in comparisons) {
		comparisonsOption += '<option value="' + comparisons[i] + '">' + comparisons[i] + '</option>'
	}
	let comparisonsSelect = $(havingTemplateTwo).find('select.comparisons');
	comparisonsSelect.html(comparisonsOption);
	comparisonsSelect.selectpicker({
		width: '100px'
	});
}

/**
 * removeConditionHaving点击事件
 * @param {Object} that
 * @param {Object} e
 */
function removeConditionHaving(that, e) {
	$(that).parents('.havingTemplateTwoo').remove();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * removeGroupHaving点击事件
 * @param {Object} that
 * @param {Object} e
 */
function removeGroupHaving(that, e) {
	$(that).closest('.havingTemplateOnee').remove();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}
