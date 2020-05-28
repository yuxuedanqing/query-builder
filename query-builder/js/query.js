/**
 * 右侧SQL实时展示
 */
function processSelect(dom) {
	var select = '';
	var select_lines = $(dom).find('.selectBody');
	$(select_lines).children().each(function(e) {
		if ($(this).attr('class') == 'selectTemplateOne') {
			var table = $(this).find('.selectFields option:selected').parent().attr("label");
			var x = table + '.' + $(this).find('.selectFields option:selected').val();
			var exp = $(this).find('.expression option:selected').val();
			if (exp != '') {
				x = exp + ' (' + x + ')';
			}
			if (select.indexOf(x) != -1) {
				alert('Field already added!')
			} else {

				if (select != '') {
					select = select + ' , ';
				}
				select = select + x;
			}

		}

	});
	return select;
}

function processFrom(dom) {
	var from = '';
	var from_model = $(dom).find('.fromBody');
	$(from_model).children().each(function(e) {
		if ($(this).attr('class').indexOf('frmTemp')!=-1) {
			// logic for join
			var join = $(this).find('.join option:selected').val();
			if (typeof(join) != 'undefined' && join != null && join!='') {
				var col1 = $(this).find('.fieldsOne option:selected').parent().attr("label")+"."+$(this).find('.fieldsOne option:selected').val();
				var col2 = $(this).find('.fieldsTwo option:selected').parent().attr("label")+"."+$(this).find('.fieldsTwo option:selected').val();
				var ope = $(this).find('.comparisons option:selected').val();
				var table1 = $(this).prev().find('.selectTable option:selected').val();
				var table2 = $(this).find('.selectTable option:selected').val();
				from += ' ' + join + ' ' + table2 + ' ON ' + col1 + ope + col2;

			} else {
				var x = $(this).find('.selectTable').find('option:selected').selectpicker('val').get(0).value;
				if (from!=='' && from.indexOf(x) != -1) {
					alert('Table already added!')
				} else {
					if (from != '') {
						from += ' , ';
					}
					from += x;
				}
			}
		}
	});
	return from;
}

function processWhere(dom, where, prevOp) {
    var len = $(dom).find('.whereTemplateOne').length;
    var finalResult = '';
    if (len == 0) {
        return finalResult;
    } else {
        var lastOp = null;

        // var prevResult = result;
        for (i = 0; i <= len - 1; i++) {
            result = '';
            var group = $(dom).find('.whereTemplateOne')[i];
            if (lastOp != null) {
                finalResult = finalResult + ' ' + lastOp;

            }
            if (finalResult != '') {

                finalResult = finalResult + ' (';
            }

            //do processing here and put result in finalResult
            var currentOperator = $(group).children('.logicalOperators').find(':selected').val();
            var condition = $(group).find('.whereBody')[0];
            $(condition).children().each(function() {
                if ($(this).attr('class') == 'conditionTemplateOne') {
                    if (result != '') {
                        result = result + ' ' + currentOperator + ' ';
                    }
					var table = $(this).find('.whereFields option:selected').parent().attr("label");
                    var field = table + '.' + $(this).find('.whereFields option:selected').val();
                    var operator = $(this).find('.comparisons option:selected').val();
                    var value = "'" + $(this).find('.inputValue').val() + "'";
                    result = result + field + ' ' + operator + ' ' + value;
                }

            });

            finalResult = finalResult + result;

            //result = '(' + result + ')';

            lastOp = currentOperator;

        }

        finalResult = '(' + finalResult;
        for (i = 0; i <= len - 1; i++) {
            finalResult += ')';
        }
        return finalResult;
    }
}

function processGroupby(dom){
	var groupby = '';
	var groupby_lines = $(dom).find('.group-by-body');
	$(groupby_lines).children().each(function(e) {
	    if ($(this).attr('class') == 'groupByTemplateOne') {
			var table = $(this).find('.groupbyFields option:selected').parent().attr("label");
	        var x = table + '.' + $(this).find('.groupbyFields option:selected').val();
	        if (groupby.indexOf(x) != -1) {
	            alert('Column already added!')
	        } else {
	            if (groupby != '') {
	                groupby = groupby + ' , ';
	            }
	            groupby = groupby + x;
	        }
	
	    }
	
	});
	return groupby;
}

function processHaving(dom){
	var len = $(dom).find('.havingTemplateOnee').length;
	var finalResult = '';
	if (len == 0) {
	    return finalResult;
	} else {
	    var lastOp = null;
	
	    // var prevResult = result;
	    for (i = 0; i <= len - 1; i++) {
	        result = '';
	        var group = $(dom).find('.havingTemplateOnee')[i];
	        if (lastOp != null) {
	            finalResult = finalResult + ' ' + lastOp;
	
	        }
	        if (finalResult != '') {
	
	            finalResult = finalResult + ' (';
	        }
	
	        //do processing here and put result in finalResult
	        var currentOperator = $(group).children('.logicalOperators').find(':selected').val();
	        var condition = $(group).find('.havingBody')[0];
	        $(condition).children().each(function() {
	            if ($(this).attr('class') == 'havingTemplateTwoo') {
	                if (result != '') {
	                    result = result + ' ' + currentOperator + ' ';
	                }
					var table = $(this).find('.fields option:selected').parent().attr("label");
	                var expression = $(this).find('.expression option:selected').val();
	                var field = table + '.' + $(this).find('.fields option:selected').val();
	                var operator = $(this).find('.comparisons option:selected').val();
	                var value = "'" + $(this).find('.inputValue').val() + "'";
	                if (expression != '') {
	                    result += expression + '(' + field + ') ' + operator + ' ' + value;
	
	                } else {
	
	                    result = result + field + ' ' + operator + ' ' + value;
	
	                }
	            }
	
	        });
	
	        finalResult = finalResult + result;
	
	        //result = '(' + result + ')';
	
	        lastOp = currentOperator;
	
	    }
	
	    finalResult = '(' + finalResult;
	    for (i = 0; i <= len - 1; i++) {
	        finalResult += ')';
	    }
	    return finalResult;
	}
}

function processOrder(dom){
	var order = '';
	var order_lines = $(dom).find('.order-by-body');
	$(order_lines).children().each(function(e) {
	    if ($(this).attr('class') == 'orderByTemplateOne') {
			var table = $(this).find('.fields option:selected').parent().attr("label");
	        var x = table + '.' + $(this).find('.fields option:selected').val();
	        if (order.indexOf(x) != -1) {
	            alert('Field already added!')
	        } else {
	            var by = $(this).find('.orderBy option:selected').val();
	            if (by == 'Ascending') {
	                by = 'ASC';
	            } else if (by == 'Descending') {
	                by = 'DSC';
	            }
	            x += ' ' + by;
	            if (order != '') {
	                order += ' , ';
	            }
	            order += x;
	        }
	
	    }
	
	});
	return order;
}

/**
 * 更新右侧SQL
 * @param {Object} clause	更新部分（from，where，select...）
 * @param {Object} e
 */
function updateJson(clause,e){
	if (clause == 'select') {
	    var select_con = $('.select');
	    var select = processSelect(select_con);
	    if (select != '') {
	        select = 'SELECT  ' + select;
	    }
	
	    $('#outputSelect').text(select);
	} else if (clause == 'from') {
	    var from_con = $('.from');
	    let from = processFrom(from_con);
	    if (from != '') {
	        from = 'FROM  ' + from;
	    }
	    $('#outputFrom').text(from);
	
	
	} else if (clause == 'where') {
	    where = '';
	    var where_con = $('.where');
	    var where = processWhere(where_con, where);
	    if (where != '') {
	        where = 'WHERE ' + where;
	    }
	    $('#outputWhere').text(where);
	} else if (clause == 'groupby') {
	    var group_by = $('.group-by');
	    var groupby = processGroupby(group_by);
	    if (groupby != '') {
	        groupby = 'GROUP BY  ' + groupby;
	    }
	
	    $('#outputGroupby').text(groupby);
	} else if (clause == 'having') {
	    var having_d = $('.having');
	    var having = processHaving(having_d);
	    if (having != '') {
	        having = 'HAVING  ' + having;
	    }
	    $('#outputHaving').text(having);
	} else if (clause == 'order') {
	    var order_by = $('.order-by');
	    var order = processOrder(order_by);
	    if (order != '') {
	        order = 'ORDER  ' + order;
	    }
	
	    $('#outputOrderby').text(order);
	
	}
	e.preventDefault();
	e.stopImmediatePropagation();
	e.stopPropagation();
}
