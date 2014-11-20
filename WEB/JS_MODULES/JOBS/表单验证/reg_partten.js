/**
 * @author: yao wang 
 * @time: 9/29/2014
 * @description: regexp pattern for form validate
 */
var reg_pattern = {
	email: /^[\w\-\.]+@[\w\.-]+\.[a-zA-Z]{2,6}$/,
	phone:/^\d{3}-\d{8}$|^\d{4}-\d{7}$/, //座机
	mobile: /^0?1[3-9]\d{9}$/, //手机
	account_en: /^[a-zA-Z]\w{5,19}$/, //英文名，带数字
	account_cn: /^[\u4e00-\u9fa5]{2,4}$/, //中文名
	password:/^.{6,20}$/,
	qq:/^[1-9][0-9]{5-11}$/,
	notNull:/^.{1,200}$/,
	price: function (o) {
		return (+o.value) >= 0;
	}
};