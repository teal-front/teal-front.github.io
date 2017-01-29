//右侧悬浮
!function () {
	var anchors = [],
		anchors_offset = [],
		length = 0;
	var right_nav = $("#right_nav"),
		nav = right_nav.find("li");
	right_nav.find("a").each(function () {
		 anchors.push(this.getAttribute('href'));
	});
	$(anchors).each(function (i) {
		anchors_offset.push($(anchors[i]).offset().top);
	});
	length = anchors.length;
	
	$(window).bind('scroll.fixed', function () {
		var scroll_top = $(window).scrollTop();
		nav.removeClass("on");
		
		//第一个anchor以上
		if (scroll_top < anchors_offset[0]) {
			nav.eq(0).addClass('on');
			return;
		}
		//最后一个anchor以下
		if (scroll_top >= anchors_offset[length - 1]) {
			nav.eq(length - 1).addClass('on');
			return;
		}
		//其他的
		for(var i = 0; i < length; i++) {
			if (scroll_top >= anchors_offset[i] && scroll_top < anchors_offset[i + 1]) {
				nav.eq(i).addClass('on');
				return;
			}
		}
		
		
	});
	$(window).trigger('scroll.fixed');
}();