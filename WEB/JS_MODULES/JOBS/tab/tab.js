/**
 * author: teal
 * 08/21/2014
 * description: tab切换,支持tab嵌套。自动检测tab-btn是否同级
 * use: .b-tab > (.b-tab-btn[.select] + (.b-tab-item > .b-tab-list))
 */
$(".b-tab").on("click", ".b-tab-btn", function () {
	var $this = $(this),
		isRate = $this.next().length || $this.prev().length ? true : false, //判断按钮是不是在同级中
		index = isRate ? $this.index() : $(this.parentNode).index(),
		$wrap = $this.closest(".b-tab"),
		$siblings = filter($wrap.find(".b-tab-btn")),
		$tabContent = filter($wrap.find(".b-tab-item")),
		$tabList = filter($tabContent.find(".b-tab-list"));
	$tabList.hide().eq(index).show();
	$siblings.removeClass("select").eq(index).addClass("select");
	return false;

	function filter ($elem) {
		return $elem.filter(function () {
			var $this = $(this);
			return $this.closest(".b-tab")[0] === $wrap[0];
		});
	}
});