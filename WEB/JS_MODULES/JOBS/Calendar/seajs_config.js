var seajs_cfg = {
    // 别名配置
    alias: {

		//WdatePicker.js里面会引用这三个文件到iframe里，路径是相对于seajs引用目录的
        "calendar1": "tools/calendar/js/calendar.js",
        "zh-cn": "tools/calendar/lang/zh-cn.js",
        "datapicker": "tools/calendar/skin/default/datepicker.css"
    }
};

seajs.config(seajs_cfg);
