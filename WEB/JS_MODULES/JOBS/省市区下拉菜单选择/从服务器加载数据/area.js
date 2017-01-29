define(function (require, exports, module) {
    var AJAX_GET_AREA = "/city_data_response.php";

    var renderSelect = function ($sel, url, selectedKey) {
        selectedKey = selectedKey || "";
        $.post(url, function (d) {
            if(d){
                var array = d,
                    html = "<option value='-1'>请选择</option>";
                var i = 0, l = array.length, selected, item;
                if (l != 0) {
                    for (; i < l; i++) {
                        item = array[i];
                        selected = item === selectedKey ? "selected" : "";
                        html += '<option ' + selected +' value="' + item + '">' + item + '</option>';
                    }
                    $sel.html(html).show();
                } else {
                    $sel.hide();
                }
            }
        }, "json");
    };

    //地址下拉元素绑定事件
    exports.setup = function (selectors) {
        selectors || (selectors = []);
        var $province = $(selectors[0] || "#area-province"),
            $city = $(selectors[1] || "#area-city"),
            $zone = $(selectors[2] || "#area-zone");
        $province.change(function () {
            var url = AJAX_GET_AREA + "?action=city&province=" + this.options[this.selectedIndex].innerHTML;
            renderSelect($city, url);
        });
        $city.change(function () {
            var url = AJAX_GET_AREA + "?action=county&city=" + this.options[this.selectedIndex].innerHTML + "&province=" + $province[0].options[$province[0].selectedIndex].innerHTML;
            renderSelect($zone, url);
        });

        //初始化地址，赋值
        var province = $province.val(), city = $city.val(), county = $zone.val();

        renderSelect($province, AJAX_GET_AREA + "?action=province", province);

        if (city !== "") {
            renderSelect($city, AJAX_GET_AREA + "?action=city&province=" + encodeURI(province), city);
        }
        if (county !== "") {
            renderSelect($zone, AJAX_GET_AREA + "?action=county&province=" + encodeURI(province) + "&city=" + encodeURI(city), county);
        }
    };
});