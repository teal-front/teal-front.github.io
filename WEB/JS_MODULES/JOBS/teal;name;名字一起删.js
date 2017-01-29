// bat delete
// teal;realwall;     按下删除键时，删除realwall;
    var bat_delete_except_class = ".js-bat-delete-except";
    $(":text").not(bat_delete_except_class).keydown(function (e) {
        var input_char_code = e.which,
            reg = /[^;]+;$/;

        // 删除按钮
        if (input_char_code == 8 && reg.test(this.value)) {
            e.preventDefault();
            this.value = this.value.replace(reg, "");
        }
    });