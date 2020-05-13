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
