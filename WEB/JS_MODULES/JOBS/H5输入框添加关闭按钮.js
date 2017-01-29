/**
 * 输入框获得焦点时，出现X按钮
 * 失焦时，X按钮消失
 */

function bind_input_close () {
        var close_html = '<div class="clear-input hide js-x-input-close"><i></i></div>',
            close_class = ".js-x-input-close",          // 关闭按钮选择器
            bind_flag_class = "js-x-input-bind",     // 已绑定关闭按钮的标记
            disabled_class = ".js-x-input-disabled",        // [第二期]不添加关闭按钮时，加在input上的标记
            enabled_class = ".js-x-input";   //  添加关闭按钮选择器

        //[第二期]var inputs = $("input[type=text], input[type=password], input[type=email], input[type=number]").not(disabled_class);
        var inputs = $(enabled_class).not("." + bind_flag_class);

        // 添加关闭按钮
        inputs.each(function () {
            var close_btn = $(close_html);

            close_btn.insertAfter($(this).parent());

            // 关闭按钮与输入框的相互DOM绑定
            close_btn.data("input", $(this));
            $(this).data("close-btn", close_btn);

            // 添加已绑定关闭按钮的标记，防重复绑定
            $(this).addClass(bind_flag_class);
        });
        // 监听输入事件
        inputs.on("input", function () {
            var close_btn = $(this).data("close-btn");

            if ($.trim(this.value) == "") {
                close_btn.addClass(G_HIDE_CLS);
            } else {
                close_btn.removeClass(G_HIDE_CLS);
            }
        });
        // 输入框获得焦点
        inputs.on("focus", function () {  //[CR] by realwall 印象中focus事件是有兼容性问题的，而且反应不够快，可以考虑使用touchstart事件
            if ($.trim(this.value) != "") {
                $(this).data("close-btn").removeClass(G_HIDE_CLS);
            }
        });
        // 输入框失去焦点事件
        inputs.on("blur", function () {
            var _this = this;

            // 防止点击关闭按钮同时触发失焦
            setTimeout(function () {
                var close_btn = $(_this).data("close-btn");
                close_btn.addClass(G_HIDE_CLS);
            }, 100);
        });
        // 关闭按钮事件
        $(document).on("touchstart click", close_class, function () {
            var $this = $(this),  //[CR] by realwall 与blur事件中this的使用方式不一样，建议保持一致
                input = $this.data("input");

            $this.addClass(G_HIDE_CLS);
            input.val("");
            setTimeout(function () {
                input.focus();
            }, 5);
        });
    }