!function ($) {
	var DetectTouch = {};
	DetectTouch.bind = function (trigger, tipbox, eventType, defaultDire) {
		var trigger = $(trigger),
			tipbox = $(tipbox),
			eventType = eventType || "click",
			defaultDire = defaultDire || "down";

		$(document).on(this.trigger, this.eventType, function (e) {
			switch (defaultDire) {
				case "down":

					break;
			}
		});

		return DetectTouch;





		function detectDire () {
			var 

			return "up";
		}
	};
	DetectTouch.handle = funtion (defaultDire) {


		return 
	};

	window.DetectTouch = DetectTouch;

}(jQuery);