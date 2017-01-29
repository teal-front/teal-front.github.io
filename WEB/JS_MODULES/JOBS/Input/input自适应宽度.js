// global auto input(超过输入框设置的最小宽度时，随内容的增加而变长)
// demo html： input.js-g-auto-input[data-width=200][data-font-size=14]
    +function () {
        $(".js-g-auto-input").on("focus keyup self_trigger", function () {
            var padding = parseInt(getComputedStyle(this).paddingLeft, 10) + parseInt(getComputedStyle(this).paddingRight, 10) + parseInt(getComputedStyle(this).borderLeft, 10) + parseInt(getComputedStyle(this).borderRight, 10),
                min_width = $(this).data("default-width") - padding,
                font_size = $(this).data("font-size"),
                real_width = get_real_width(this, font_size);

            this.style.width = Math.max(min_width, real_width) + padding +  "px";
        }).trigger("self_trigger");


        // exec input's content true width
        function get_real_width(ele, font_size) {
            var tmp = document.createElement("span"),
                width;
            font_size = font_size || 14;

            tmp.style.cssText = "font-size:" + font_size + "px;";  // 同input的font-size
            tmp.innerHTML = ele.value;
            document.body.appendChild(tmp);
            width = tmp.getBoundingClientRect().width;
            document.body.removeChild(tmp);
            return width;
        }
    }();