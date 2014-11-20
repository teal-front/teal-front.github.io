 function scaleImg() {
    var sImg = this.$lists.find('img');
    imageLoad(sImg, 'fadeIn', 285, 175);
    function imageLoad(obj, e, mw, mh) {
        obj.each(function () {
            var o = $(this);
            if(this.src ) return;
            var that = this;
            var u = o.attr('_src');
            var img = new Image();
            var w = mw || o.parent().width();
            var h = mh || o.parent().height();
            img.src = u;
            if (img.complete) {
                imgSize(o, img);
                this.parentNode.style.background = "none";
            } else {
                img.onload = function () {
                    imgSize(o, img);
                    that.parentNode.style.background = "none";
                };
            }
            function imgSize(q, p) {
                q.attr('src', u);
                if (p.width * h >= p.height * w && p.width > w) {
                    var newHeight = p.height * (w / p.width);
                    var newMarginTop = (h - newHeight) / 2;
                    o.css({ width: w, height: newHeight, marginTop: newMarginTop });
                } else if (p.width * h < p.height * w && p.height > h) {
                    o.css({ width: p.width * (h / p.height), height: h });
                } else {
                    o.css({ width: p.width, height: p.height, marginTop: (h - p.height) / 2 });
                }
                if (e == 'fadeIn') {
                    q.fadeIn('slow');
                } else {
                    q.show();
                }
            }
        });
    }
}
