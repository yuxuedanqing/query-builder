/**
 * 查询 Node
 */
function queryNode() {
	//输入框输入定时自动搜索
	let to = false;
	$('#keywordSearch').keyup(function() {
		if (to) {
			clearTimeout(to);
		}
		to = setTimeout(function() {
			$('#tableTree').jstree(true).search($('#keywordSearch').val());
		}, 250);
	});
}

/**
 * 显示树形结构
 */
function showTableTree() {
	$.getJSON('json/tables.json', function(json) {
		$("#tableTree").jstree({
			"core": {
				"themes": {
					"variant": "large"
				},
				"data": json.list
			},
			"plugins": ["search", "checkbox", "changed"]
		});
	})
}

/**
 * 显示已选择的 Node 数组
 */
function showCheckboxSelected() {

	$("#tableTree").on('changed.jstree', function(e, data) {
		let showSelectTable = $("#showSelectTable");
		let sel = data.node;
		// 判断父节点是不是#，如果是则直接取sel.id,不是则取sel.parent
		let parent = sel.parent === "#" ? sel.id : sel.parent;
		// 判断是选择(action: "select_node")还是取消选择(action: "deselect_node")
		if (data.action === "select_node") {
			showSelectTable.empty();
			showSelectTable.append('<ul class="list-group"></ul>');
			processSelectedNode(parent, showSelectTable);
			selectedTableTreeNode(parent, data, true);
		} else if (data.action === "deselect_node") {
			processCancelSelectedNode(parent, showSelectTable);
			selectedTableTreeNode(parent, data, false);
		}


	})
}

/**
 * 处理选择的节点
 * @param {Object} parent
 * @param {Object} showSelectTable
 */
function processSelectedNode(parent, showSelectTable) {
	selectedTables.add(parent);
	for (let i of selectedTables) {
		showSelectTable.find('ul').append('<li class="list-group-item ' + i + '">' + i + '</li>');
	}
}

/**
 * 处理取消选择的节点
 * @param {Object} parent
 * @param {Object} showSelectTable
 */
function processCancelSelectedNode(parent, showSelectTable) {
	// set移除parent
	if (selectedTables.has(parent)) {
		selectedTables.delete(parent);
	}
	// 删除li元素
	showSelectTable.find('ul.list-group > li').remove('.' + parent);
}

/**
 * 已选择的TreeNode
 * @param {Object} data
 * @param {Object} flag true:选择 false:取消选择
 */
function selectedTableTreeNode(parent, data, flag) {
	let sel = data.node;
	let selected = data.selected;
	// 判断选中的是不是父节点#，如果是则true,不是则取false
	let is_parent = sel.parent === "#" ? true : false;
	let childrenList = new Set();

	if (flag) {
		if (is_parent) {
			let childrenListNode = sel.children;
			childrenListNode.forEach(function(item, indexm, array) {
				let children = item.split(".")[1];
				childrenList.add(children);
			});
			selectedTableNodeInfo.set(parent, childrenList);
		} else {
			selected.forEach(function(item, index, array) {
				let children_name = item.split(".")[1];
				let parent_name = item.split(".")[0];
				if (parent_name == parent) {
					childrenList.add(children_name);
					selectedTableNodeInfo.set(parent_name, childrenList);
				}
			});

		}
	} else {
		if (is_parent) {
			selectedTableNodeInfo.delete(parent);
		} else {
			let childrenSet = selectedTableNodeInfo.get(parent);
			let childrenText = sel.text;
			if (childrenSet.has(childrenText)) {
				childrenSet.delete(childrenText);
			}
		}
	}

}

showTableTree();
queryNode();
showCheckboxSelected();
