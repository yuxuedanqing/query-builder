$(document).on('change', '.where', function(e) {
    updateJson('where', e);
});

$("#whereBtn").click(function(e) {
	// 判断whereBody中是否已存在whereTemplate
	let whereTemplate = $(".whereBody").find(".whereTemplateOne");
	if (whereTemplate.length > 0) {
		return;
	}
	// 判断from部分是否已经选择了表
	let selectedTable = $(".fromBody").find("select.selectTable option:selected");
	flag = false;
	for (let table = 0; table < selectedTable.length; table++) {
		let ttable = selectedTable[table].value;
		if (ttable != "") {
			flag = true;
		}
	}
	if (flag) {
		addWhere(this, e);
	} else {
		alert("请先从from中选择表")
	}
});

/**
 * 添加whereTemplate
 * @param {Object} e
 */
function addWhere(that, e) {
	let whereTemplate = $(".whereTemplate").clone();
	addWhereOptions(whereTemplate);
	$(whereTemplate).appendTo($(that).siblings('.whereBody')).on("click", ".addCondition", function(e) {
		addCondition(this, e);
	}).on("click", ".removeGroup", function(e) {
		removeGroup(this, e);
		updateJson('where', e);
	}).on("click", ".addGroup", function(e) {
		addWhere(this, e);
	});
	whereTemplate.attr("class", "whereTemplateOne");
	whereTemplate.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 为whereTemplate的select添加option
 * @param {Object} e
 */
function addWhereOptions(whereTemplate) {
	let operatorsOption = '';
	for (i in logicalOperators) {
		operatorsOption += '<option value="' + logicalOperators[i] + '">' + logicalOperators[i] + '</option>';
	}
	let logicalOperatorsOption = $(whereTemplate).find(".logicalOperators");
	logicalOperatorsOption.html(operatorsOption);
	logicalOperatorsOption.selectpicker({
		width: '140px'
	});
}

/**
 * addCondition点击事件
 */
function addCondition(that, e) {
	var conditionTemplate = $('.conditionTemplate').clone();
	conditionTemplate.show();
	addConditionOption(conditionTemplate);
	$(conditionTemplate).appendTo($(that).siblings(".whereBody")).on("click", ".removeCondition", function(e) {
		removeCondition(this, e);
		updateJson('where', e);
	});
	conditionTemplate.attr('class', 'conditionTemplateOne');
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 给conditionTemplate模板的select添加option
 * @param {Object} conditionTemplate
 */
function addConditionOption(conditionTemplate) {
	let whereFields = $(conditionTemplate).find("select.whereFields");
	selectedTableNodeInfo.forEach(function(value, key, map) {
		let optgroup = $("<optgroup>").attr("label", key);
		for (let item of value) {
			let option = new Option(item, item);
			optgroup.append(option);
		}
		whereFields.append(optgroup[0]);
	});
	whereFields.selectpicker({
		width: '140px'
	});

	//关系运算符选项
	let comparisonOption = '';
	for (i in comparisons) {
		comparisonOption += '<option>' + comparisons[i] + '</option>'
	}
	let comparisonsSelect = $(conditionTemplate).find('select.comparisons');
	comparisonsSelect.html(comparisonOption);
	comparisonsSelect.selectpicker({
		width: '100px'
	});
}

/**
 * 移除where group
 * @param {Object} that
 * @param {Object} e
 */
function removeGroup(that, e) {
	$(that).closest('.whereTemplateOne').remove();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 移除where condition
 * @param {Object} that
 * @param {Object} e
 */
function removeCondition(that, e) {
	$(that).parents('.conditionTemplateOne').remove();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}
