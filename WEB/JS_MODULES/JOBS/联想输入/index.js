/**
 * @author: yao wang
 * @time: 9/25/2014
 * @discription: 用作输入框的自动输入，支持键盘上下操作选项，Esc、Enter键。
 *              支持输入框的初始化，及选择完成后的回调。
                数据没有持久化，每次都要请求，不适应做纯粹的下拉菜单。
 * @use: input:text + (div > ul)
 */
!function ($) {
    var AutoComplete = function ($input, $ul, ajaxURL, callback, isInit) {
        this.$input = $input;
        this.$ul = $ul;
        this.ajaxURL = ajaxURL; //可接收函数，用作动态地址
        this.callback = callback || $.noop;

        this.init(isInit);
    };
    AutoComplete.fn = AutoComplete.prototype;
    AutoComplete.fn.init = function (isInit) {
        var that = this;
        this.$ul.on("mouseover", "li", function (e) {
            that.mouseoverHandleOfLi.apply(this, [e, that]);
        }).on("mouseout", "li", function (e) {
            that.mouseoutHandleOfLi.apply(this, [e, that]);
        }).on("click", "li", function (e) {
            that.clickHandleOfLi.apply(this, [e, that]);
        });
        this.$input.bind({
            focus: function (e) {
                that.renderResult.apply(this, [e, that]);
            },
            keyup: function (e) {
                that.chooseLi.apply(this, [e, that]);
            }
        });
        $(document).on("click", function (e) {
            if (that.$input[0] !== e.target) {
                that.$ul.parent().hide();
            }
        });

        //a.k.a. edit, has initiaztion value
        if (isInit) {
            this.renderResult(null, that, true);
        }
    };
    AutoComplete.fn.renderResult = function (e, that, isInit, callback) {
        var renderHTML = '<li data-key="${matchword}" data-id="${id}" class="bdsug-overflow"><b>${keyword}</b>${otherkeyword}</li>',
            keyword = that.$input.val().replace(/^\s+|\s+$/g, "");
        $.ajax({
            type: "get",
            url: typeof that.ajaxURL === "function" ? that.ajaxURL() : that.ajaxURL, 
            dataType: "json",
            data: "",
            success: function (d) {
                if (!d.rows) { return; }
                var words = d.rows,
                    html = "";
                var i = 0, l = words.length, matchword, otherkeyword;
                for (; i < l; i++) {
                    otherkeyword = matchword = words[i].name;
                    if (matchword.indexOf(keyword) === 0) { //只匹配开头
                        otherkeyword = otherkeyword.replace(keyword, "");
                        html += renderHTML.replace("${matchword}", matchword).replace("${id}", words[i].id).replace("${keyword}", keyword).replace("${otherkeyword}", otherkeyword);
                    }
                }
                that.$ul.html(html);
                if (isInit) {
                    that.$input.val(d.rows[0].name);
                    that._complete(d.rows[0].id);
                } else {
                    that.$input.data("value", that.$input.val());
                    that.$ul.parent().show();
                }
                callback && callback();
            }
        });
    };
    AutoComplete.fn.chooseLi = function (e, that) {
        var char = e.keyCode,//keyCode, not charCode
            KEY = {
                "UP": 38,
                "DOWN": 40,
                "ENTER": 13,
                "ESCAPE": 27
            };
        switch (char) {
            case KEY.UP:
                if (that.$ul.parent().is(":visible")) {
                    that._upAndDownOfLi.call(that, "up");
                } else {
                    that.renderResult(null, that, false, function () {
                        that._upAndDownOfLi.call(that, "up");
                    });
                }                
                break;
            case KEY.DOWN:
                if (that.$ul.parent().is(":visible")) {
                    that._upAndDownOfLi.call(that, "down");
                } else {
                    that.renderResult(null, that, false, function () {
                        that._upAndDownOfLi.call(that, "down");
                    });
                }  
                break;
            case KEY.ESCAPE:
            case KEY.ENTER:
                that._complete.call(that);
                break;
            default:
                that.renderResult.call(this, e, that);
        }
    };
    AutoComplete.fn._upAndDownOfLi = function (direction) {
        var $ul = this.$ul,
            oLiCollection = $ul.find("li").toArray(),
            $input = this.$input;

        var newLi = document.createElement("li");
        newLi.setAttribute("data-key", $input.data("value"));
        oLiCollection.push(newLi);

        var i = 0, length = oLiCollection.length, next,
            index = length - 1;
        for (; i < length; i++) {
            if (/\bbdsug\-s\b/.test(oLiCollection[i].className)) {
                index = i;
                break;
            }
        }
        if (direction === "up") {
            next = index - 1;
            next < 0 && (next = length - 1);
        } else if (direction === "down") {
            next = index + 1;
            next > length -1 && (next = 0);
        }
        index >= 0 && (oLiCollection[index].className = oLiCollection[index].className.replace(/\bbdsug\-s\b/g, ""));
        oLiCollection[next].className += " bdsug-s";
        $input.val(oLiCollection[next].getAttribute("data-key"));
    };
    AutoComplete.fn._complete = function (id) {
        this.$ul.parent().hide();
        this.$input.data("value", this.$input.val());
        id = id || this.$ul.find(".bdsug-s").data("id");
        id && this.callback(id);
    };
    AutoComplete.fn.mouseoverHandleOfLi = function (e) {
        this.className += " bdsug-s";
    };
    AutoComplete.fn.mouseoutHandleOfLi = function (e) {
        this.className = this.className.replace(/\bbdsug\-s\b/g, "");
    };
    AutoComplete.fn.clickHandleOfLi = function (e, that) {
        that.$input.val(this.getAttribute("data-key"));
        that._complete.call(that);
    };

    window.AutoComplete = AutoComplete;
}(jQuery);