$("#orderByBtn").click(function(e) {
	// 判断order by是否已有模板
	let orderByTemplate = $(".order-by-body").find(".orderByTemplateOne");
	if (orderByTemplate.length > 0) {
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
		addOrderBy(this, e);
	} else {
		alert("请先从from中选择表");
		return;
	}
});

/**
 * 添加模板orderByTemplate
 * @param {Object} that
 * @param {Object} e
 */
function addOrderBy(that, e) {
	let orderByTemplate = $(".orderByTemplate").clone();
	addOrderByOption(orderByTemplate);
	$(orderByTemplate).appendTo($(that).siblings('.order-by-body')).on('click', '.orderAdd', function(e) {
		addOrderBy($('#orderByBtn'), e);
	}).on('click', '.orderRemove', function(e) {
		$(this).closest('.orderByTemplateOne').remove();
	});
	orderByTemplate.attr('class', 'orderByTemplateOne');
	orderByTemplate.show();
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}

/**
 * 为orderByTemplate模板的select添加option
 * @param {Object} orderByTemplate
 */
function addOrderByOption(orderByTemplate) {
	let fieldsSelect = $(orderByTemplate).find("select.fields");
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
	var orderByOption = '';
	for (i in orderBy) {
		orderByOption += '<option value="' + orderBy[i] + '">' + orderBy[i] + '</option>'
	}
	let orderBySelect = $(orderByTemplate).find('select.orderBy');
	orderBySelect.html(orderByOption);
	orderBySelect.selectpicker({
		width: '100px'
	});
}
