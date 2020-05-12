/**
 * 自定义js
 */

$(function(){
	
	// 定义全局选中的表
	var selectedTables = new Set();
	
	// 定义全局选中的表optionGroup
	var selectedTableTree = [];
	
	// 定义全局选中的表父子节点信息
	var selectedTableNodeInfo = new Map();
	
	// 定义from选中的表的父子节点信息
	var fromSelectedTable = new Map();
	
	// 定义比较规则
	var comparisons = ['=', '<>', '<', '<=', '>', '>=', 'LIKE', 'NOT LIKE', 'IS', 'IS NOT','IN','NOT IN', 'EXISTS','NOT EXISTS','BETWEEN','NOT BETWEEN'];
	
	// 定义逻辑运算符
	var logicalOperators = ['AND', 'OR'];
	
	// 定义排序方式
	var orderBy = ['Ascending', 'Descending'];
	
	// 定义表达函数
	var expression = ['','COUNT', 'MAX','MIN','SUM'];
	
	// 定义表连接
	var joins = ['INNER JOIN','LEFT JOIN','RIGHT JOIN'];
	
	/**
	 * 查询 Node
	 */
	function queryNode(){
		//输入框输入定时自动搜索
		let to = false;
		$('#keywordSearch').keyup(function () {
			if(to) {
				clearTimeout(to);
			}
			to = setTimeout(function () {
				$('#tableTree').jstree(true).search($('#keywordSearch').val());
			}, 250);
		});
	}
	
	/**
	 * 显示树形结构
	 */
	function showTableTree(){
		$.getJSON('json/tables.json', function (json) {
			$("#tableTree").jstree({
				"core": {
					"themes": {
						"variant" : "large"
					},
					"data": json.list
				},
				"plugins": ["search","checkbox","changed"]
			});
		})
	}
	
	/**
	 * 显示已选择的 Node 数组
	 */
	function showCheckboxSelected(){
		
		$("#tableTree").on('changed.jstree', function (e, data) {
			let showSelectTable = $("#showSelectTable");
			let sel = data.node;
			// 判断父节点是不是#，如果是则直接取sel.id,不是则取sel.parent
			let parent = sel.parent==="#" ? sel.id : sel.parent;
			// 判断是选择(action: "select_node")还是取消选择(action: "deselect_node")
			if(data.action==="select_node"){
				showSelectTable.empty();
				showSelectTable.append('<ul class="list-group"></ul>');
				processSelectedNode(parent,showSelectTable);
				selectedTableTreeNode(parent,data,true);
			}else if(data.action==="deselect_node"){
				processCancelSelectedNode(parent,showSelectTable);
				selectedTableTreeNode(parent,data,false);
			}
			

		})
	}
	
	/**
	 * 处理选择的节点
	 * @param {Object} parent
	 * @param {Object} showSelectTable
	 */
	function processSelectedNode(parent,showSelectTable){
		selectedTables.add(parent);
		for (let i of selectedTables){
			showSelectTable.find('ul').append('<li class="list-group-item '+i+'">'+i+'</li>');
		}
	}
	
	/**
	 * 处理取消选择的节点
	 * @param {Object} parent
	 * @param {Object} showSelectTable
	 */
	function processCancelSelectedNode(parent,showSelectTable){
		// set移除parent
		if (selectedTables.has(parent)){
			selectedTables.delete(parent);
		}
		// 删除li元素
		showSelectTable.find('ul.list-group > li').remove('.'+parent);
	}
	
	/**
	 * 已选择的TreeNode
	 * @param {Object} data
	 * @param {Object} flag true:选择 false:取消选择
	 */
	function selectedTableTreeNode(parent,data,flag) {
		let sel = data.node;
		let selected = data.selected;
		// 判断选中的是不是父节点#，如果是则true,不是则取false
		let is_parent = sel.parent==="#" ? true : false;
		let childrenList = new Set();
		
		if(flag){
			if(is_parent){
				let childrenListNode = sel.children;
				childrenListNode.forEach(function (item, indexm, array){
					let children = item.split(".")[1];
					childrenList.add(children);
				});
				selectedTableNodeInfo.set(parent,childrenList);
			}else{
				selected.forEach(function(item, index, array){
					let children_name = item.split(".")[1];
					let parent_name = item.split(".")[0];
					if(parent_name==parent){
						childrenList.add(children_name);
						selectedTableNodeInfo.set(parent_name,childrenList);
					}
				});
				
			}
		}else{
			if(is_parent){
				selectedTableNodeInfo.delete(parent);
			}else{
				let childrenSet = selectedTableNodeInfo.get(parent);
				let childrenText = sel.text;
				if(childrenSet.has(childrenText)){
					childrenSet.delete(childrenText);
				}
			}
		}
		
	}
	
	// from部分
	$("#fromBtn").click(function(e){
		// 判断左侧是否已选择表
		let checkTableIsSelected = selectedTables.size > 0 ? true: false;
		if(checkTableIsSelected){
			// 判断是否已经点击过form
			let fromTemplateOneList = $(".fromBody").children(".fromTemplateOnee");
			if(fromTemplateOneList.length>0){
				return false;
			}
			addFrom(e);
		}else{
			alert("请选择左侧表");
		}
	});
	
	/**
	 * 添加from选项
	 * @param {Object} that
	 * @param {Object} e
	 */
	function addFrom(e){
		let fromTemplateOne = $(".fromTemplateOne").clone(true);
		addFromOptions(fromTemplateOne);
		$(fromTemplateOne).appendTo($(".fromBody"));
		fromTemplateOne.attr("class","fromTemplateOnee");
		fromTemplateOne.show();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	}
	
	/**
	 * 给selectTable赋值
	 * @param {Object} fromTemplate
	 */
	function addFromOptions(fromTemplate){
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
	$(".fromBody").on("click",".addJoinBtn",function(e){
		let fromTemplateTwo = $(".fromTemplateTwo").clone(true);
		// 添加option
		addJoinOptions(fromTemplateTwo);
		$(fromTemplateTwo).appendTo($(".fromBody"));
		fromTemplateTwo.attr("class","fromTemplateTwoo");
		fromTemplateTwo.show();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	});
	
	
	/**
	 * 添加option到fromTemplate
	 * @param {Object} fromTemplate
	 */
	function addJoinOptions(fromTemplate){
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
	function fieldsSelectpicker(fromTemplate){
		let fieldsOne = $(fromTemplate).find('select.fieldsOne');
		let fieldsTwo = $(fromTemplate).find('select.fieldsTwo');
		selectedTableNodeInfo.forEach(function(value, key, map){
			let optgroup = $("<optgroup>").attr("label",key);
			for (let item of value){
				let option = new Option(item,item);
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
	
	// join右侧删除按钮事件
	$(".fromBody").on("click", ".removeJoinBtn", function(e){
		$(this).closest(".fromTemplateOnee").remove();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	});
	
	$(".fromBody").on("click", ".removeJoinBtn", function(e){
		$(this).closest(".fromTemplateOnee").remove();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	});
	
	$(".fromBody").on("click", ".removeJoinBtnTwo", function(e){
		$(this).closest(".fromTemplateTwoo").remove();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	})
	
	// select部分
	$("#selectBtn").on("click",function(e){
		// 判断select部分是否已经生成了selectTemplate
		let selectTemplate = $(".selectBody").find(".selectTemplate");
		if(selectTemplate.length>0){
			return;
		}
		// 判断from部分是否已经选择了表
		let selectedTable = $(".fromBody").find("select.selectTable option:selected");
		let flag = false;
		for(let table=0;table<selectedTable.length;table++){
			let ttable = selectedTable[table].value;
			if(ttable!=""){
				flag = true;
			}
		}
		if(flag){
			addSelect(e);
		}else{
			alert("请先从from中选择表");
			return;
		}
		
	});
	
	/**
	 * 添加selectTemplate
	 * @param {Object} e
	 */
	function addSelect(e){
		let selectTemplate = $(".selectTemplate").clone(true);
		addSelectOptions(selectTemplate);
		$(selectTemplate).appendTo($(".selectBody"));
		selectTemplate.attr("class","selectTemplateOne");
		selectTemplate.show();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	}
	
	/**
	 * 给selectTemplate的select框赋值
	 * @param {Object} selectTemplate
	 */
	function addSelectOptions(selectTemplate){
		let expressionOption = '';
		for(i in expression){
			expressionOption += '<option value="'+expression[i]+'">'+expression[i]+'</option>';
		}
		let expressionSelect = selectTemplate.find('select.expression');
		expressionSelect.html(expressionOption);
		expressionSelect.selectpicker({
			width: '140px'
		});
		
		let selectFields = selectTemplate.find("select.selectFields");
		selectedTableNodeInfo.forEach(function(value, key, map){
			let optgroup = $("<optgroup>").attr("label",key);
			for (let item of value){
				let option = new Option(item,item);
				optgroup.append(option);
			}
			selectFields.append(optgroup[0]);
		});
		selectFields.selectpicker({
			width: '140px'
		});
	}
	
	/**
	 * select部分的删除操作
	 */
	$(".selectBody").on('click','.selectRemove',function(e){
		$(this).closest(".selectTemplateOne").remove();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	});
	
	/**
	 * select部分的添加操作
	 */
	$(".selectBody").on("click", ".selectAdd", function(e){
		addSelect(e);
	});
	
	// where部分操作
	$("#whereBtn").click(function(e){
		// 判断whereBody中是否已存在whereTemplate
		let whereTemplate = $(".whereBody").find(".whereTemplateOne");
		if(whereTemplate.length>0){
			return;
		}
		// 判断from部分是否已经选择了表
		let selectedTable = $(".fromBody").find("select.selectTable option:selected");
		flag = false;
		for(let table=0;table<selectedTable.length;table++){
			let ttable = selectedTable[table].value;
			if(ttable!=""){
				flag = true;
			}
		}
		if(flag){
			addWhere(this, e);
		}else{
			alert("请先从from中选择表")
		}
	});
	
	/**
	 * 添加whereTemplate
	 * @param {Object} e
	 */
	function addWhere(that, e){
		let whereTemplate = $(".whereTemplate").clone();
		addWhereOptions(whereTemplate);
		$(whereTemplate).appendTo($(that).siblings('.whereBody')).on("click",".addCondition",function(e){
			addCondition(this,e);
		}).on("click",".removeGroup",function(e){
			 removeGroup(this, e);
		}).on("click",".addGroup",function(e){
			addWhere(this,e);
		});
		whereTemplate.attr("class","whereTemplateOne");
		whereTemplate.show();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	}
	
	/**
	 * 为whereTemplate的select添加option
	 * @param {Object} e
	 */
	function addWhereOptions(whereTemplate){
		let operatorsOption = '';
		for(i in logicalOperators){
			operatorsOption += '<option value="'+logicalOperators[i]+'">'+logicalOperators[i]+'</option>';
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
	function addCondition(that,e){
		var conditionTemplate = $('.conditionTemplate').clone(true);
		conditionTemplate.show();
		addConditionOption(conditionTemplate);
		$(conditionTemplate).appendTo($(that).siblings(".whereBody")).on("click",".removeCondition",function(e){
			removeCondition(this, e);
		});
		conditionTemplate.attr('class','conditionTemplateOne');
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
	    selectedTableNodeInfo.forEach(function(value, key, map){
	    	let optgroup = $("<optgroup>").attr("label",key);
	    	for (let item of value){
	    		let option = new Option(item,item);
	    		optgroup.append(option);
	    	}
	    	whereFields.append(optgroup[0]);
	    });
	    whereFields.selectpicker({
	    	width: '140px'
	    });
	
		//关系运算符选项
		let comparisonOption = '<option value="">请选择</option>';
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
	function removeGroup(that,e){
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
	function removeCondition(that,e){
		$(that).parents('.conditionTemplateOne').remove();
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	}
	
	// group by部分
	$("#groupByBtn").click(function(e){
		// 判断group by是否以及生成了groupByTemplate
		let groupByTemplate = $(".group-by-body").find(".groupByTemplateOne");
		if(groupByTemplate.length>0){
			return;
		}
		// 判断from部分是否已经选择了表
		let selectedTable = $(".fromBody").find("select.selectTable option:selected");
		let flag = false;
		for(let table=0;table<selectedTable.length;table++){
			let ttable = selectedTable[table].value;
			if(ttable!=""){
				flag = true;
			}
		}
		if(flag){
			addGroupBy(this,e);
		}else{
			alert("请先从from中选择表");
			return;
		}
	});
	
	/**
	 * 添加groupByTemplate
	 * @param {Object} that
	 * @param {Object} e
	 */
	function addGroupBy(that, e){
		let groupByTemplate = $(".groupByTemplate").clone();
		groupByTemplate.show();
		$(groupByTemplate).appendTo($(that).siblings('.group-by-body')).on('click','.groupbyAdd');
	}
	
	showTableTree();
	queryNode();
	showCheckboxSelected();
})