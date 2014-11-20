/**
 * anchor: teal
 * time: 08/22/2014
 * WdatePicker: http://www.my97.net/dp/demo/index.htm
 */
;define(function (require, exports, module) {
    var WdatePicker = require("tools/calendar/WdatePicker");

    var defaults = WdatePicker.defaults = {
        hasHour: false,
        realDateFmt: "yyyy-MM-dd",
        realTimeFmt: "HH:mm:ss",
        el: null,
        doubleCalendar:true, //双日历

        isShowOK: false,
        isShowCancel: false,
        isShowToday: false,

        qsEnabled: false //快速选择，左下角有一BUTTON，列出最近一几天供选择
    };

    defaults.deteFmt = defaults.hasHour ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd";
    defaults.vel = $(defaults.el).next()[0];

    return WdatePicker;
});