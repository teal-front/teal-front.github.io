!function ($) {
	function FSM (config) {
		this.config = config;
		this.currentState = this.config.currentState;
		this.states = this.config.states;
		this.events = this.config.events;
		
		this.defineEvents();
	}
	FSM.prototype = {
		constructor: FSM,
		defineEvents: function () {
			var that = this,
				events = this.events,
				i, eventFn;
			for (i in events) {
				eventFn = events[i];
				eventFn.call(that, function (event) {
					that.fire(i, event);
				});
				that.on(i, that.handleEvents);
			}
		},
		handleEvents: function (event) {
			if (!this.currentState) return;
			var actionTransitionFunction = this.states[this.currentState][event.type];
			if (!actionTransitionFunction) return;
			this.currentState = actionTransitionFunction.call(this, event);
		},
		doTransition: function (state, type, event) {
			var actionTransitionFunction = this.states[state][type];
			if (!actionTransitionFunction) return;
			this.currentState = actionTransitionFunction.call(this, event);
		}
	};
	
	function SlideMenu (container, config) {
		var that = this;
		this.config = $.extend({
			select: ".k-select",
			box: ".k-box",
			option: ".k-option"
		}, config);
		this.container = $(container);
		var select = this.select = $(this.config.select),
			options = this.options = $(this.config.box),
			slideBox = this.slideBox = $(this.config.box);
		
		this.value = this.select.data("value") || this.options.eq(0).data("value");
		this.text = this.select.data("text") || this.options.eq(0).data("text");
		
		this.isFold = true;
		
		var stateConfig = {
			initState: "fold",
			states: {
				fold: {
					unfoldmenu: function (event) {
						that.unfold();
						return "unfold";
					}
				},
				unfold: {
					foldmenu: function (event) {
						that.fold();
						return "fold";
					},
					overitem: function (event) {
						that.highlightItem(event.currentItem);
						return "highlight";
					}					
				},
				highlight: {
					foldmenu: function (event) {
						that.fold();
						return "fold";
					},
					clickitem: function (event) {
						that.selectItem(event.currentItem);
						return "fold";
					},
					overitem: function (event) {
						that.highlightItem(event.currentItem);
						return "highlight";
					}
				}
			},
			events: {
				unfoldmenu: function (fn) {
					that.container.on("click", function (e) {
						if (that.isFold === true) fn();
					};
				},
				foldmenu: function (fn) {
					var timeout;
					that.container.on("mouseleave", function (e) {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(function () {
							fn();
						}, 1000);
					};
					this.container.on("mouseenter", function () {
						if (timeout) clearTimeout(timeout);
					};
					$("body").on("click", function () {
						if (that.isFold === false) fn();
					});
				},
				overitem: function (fn) {
					this.options.on("mouseenter", "div", function (e) {
						fn({
							currentItem: e.currentTarget
						});
					});
				},
				clickitem: function (fn) {
					this.options.on("click", function (e) {
						fn({
							currentItem: e.currentTarget
						});
					});
				}
			}
		};
		
		this.FSM = new FSM(stateConfig);
	}
	
	SlideMenu.prototype = {
		constructor: SlideMenu,
		setText: function () {
			this.select.html(this.text);
		},
		unfold: function () {
			if (!this.isFold) return;
			var that = this;
			this.slideBox.fadeIn(0.3, function () {
				that.isFold = false;
			});
		},
		fold: function () {
			var that = this;
			if (this.isFold) return;
			this.options.removeClass("hover");
			this.slideBox.slideUp(0.2, function () {
				that.isFold = true;
			});
		},
		highlightItem: function (curItem) {
			this.options.removeClass("hover");
			curItem.addClass("hover");
		},
		selectItem: function (curItem) {
			this.value = curItem.data("value");
			this.text = curItem.data("text");
			this.setText();
			this.fold();
			this.fire("select", {
				value: this.value,
				text: this.text
			});
		}
	};
	
	window.SlideMenu = SlideMenu;
}(jQuery);