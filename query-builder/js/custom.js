/**
 * 自定义js
 */

// 定义全局选中的表
var selectedTables = new Set();

// 定义全局选中的表optionGroup
var selectedTableTree = [];

// 定义全局选中的表父子节点信息
var selectedTableNodeInfo = new Map();

// 定义from选中的表的父子节点信息
var fromSelectedTable = new Map();

// 定义比较规则
var comparisons = ['=', '<>', '<', '<=', '>', '>=', 'LIKE', 'NOT LIKE', 'IS', 'IS NOT', 'IN', 'NOT IN', 'EXISTS',
	'NOT EXISTS', 'BETWEEN', 'NOT BETWEEN'
];

// 定义逻辑运算符
var logicalOperators = ['AND', 'OR'];

// 定义排序方式
var orderBy = ['Ascending', 'Descending'];

// 定义表达函数
var expression = ['', 'COUNT', 'MAX', 'MIN', 'SUM'];

// 定义表连接
var joins = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'];

/**
 * 设置表格表头
 */
function setTableHeader(){
	// 获取table的thead tr
	let trCellTitle = $("#sqlExecuteResult > thead > tr");
	clearTableHeader(trCellTitle);
	// 获取生成的sql的select部分
	let selectFields = $("#outputSelect").text();
	console.log(selectFields);
	let fields = selectFields.replace("SELECT","");
	if(fields.indexOf(",")==-1){
		let title = fields.split(".")[1];
		// 判断是否含有右括号，有则去除，无则原样返回
		let newTitle = title.indexOf(")")===-1?title:title.split(")")[0];
		let th = $("<th></th>");
		th.append(newTitle);
		trCellTitle.append(th)
	}else{
		let fieldsList = fields.split(",");
		fieldsList.forEach(function(currentValue){
			let title = currentValue.split(".")[1];
			let newTitle = title.indexOf(")")===-1?title:title.split(")")[0];
			let th = $("<th></th>");
			th.append(newTitle);
			trCellTitle.append(th);
		});
	}
	
}

/**
 * 获取查询结果
 */
function getSelectSqlResult(){
	let outputSelect = $("#outputSelect").text();
	let outputFrom = $("#outputFrom").text();
	let outputWhere = $("#outputWhere").text();
	let outputGroupby = $("#outputGroupby").text();
	let outputHaving = $("#outputHaving").text();
	let outputOrderby = $("#outputOrderby").text();
	let selectSql = outputSelect + outputFrom + outputWhere + outputGroupby + outputHaving + outputOrderby;
	
	$("#sqlExecuteResult").DataTable({
		"processing": true,
		// 去掉过滤
		"bFilter": false,
		"searching" : false,
		"ajax" : {
			"url": "json/selectResult.json"
		},
		"columns" : [
			{
				"data" : "wc_xqmc"
			},
			{
				"data" : "wc_jsmc"
			},
			{
				"data" : "wc_jslbmc"
			}
			
		]
		
	});
}

/**
 * 清除表头
 * @param {Object} trCellTitle
 */
function clearTableHeader(trCellTitle){
	trCellTitle.empty();
}

/**
 * SQL查询
 */
$("#query").click(function(){
	setTableHeader();
	getSelectSqlResult();
});