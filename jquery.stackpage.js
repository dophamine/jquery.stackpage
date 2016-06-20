;(function($, window, undefined) {

	var DEFAULTS = {
		wrapClass: 'sp-container',
		offsetTop: null,
		parent: '<div/>'
	};

	var model = {};

	function Stackpage(elements, options) {
		this.elements = elements;
		this.config	= $.extend({}, DEFAULTS, options);
		this.init();
	}

	Stackpage.prototype.init = function() {
		var that = this;

		$(document.body).css({position: "relative"});

		function calcOffsetTop(target) {
			var offsetTop = 0;
			$(target).first().parents().each(function(i, el) {
				offsetTop += $(el).offset().top;
			});
			return offsetTop;
		}

		function calcHeights () {
			var heights = [];
			var bodyHeight = 0;
			if (that.config.offsetTop) {
				that.config.parent.css({top: that.config.offsetTop - calcOffsetTop(that.elements)});
			} else {
				that.config.offsetTop = calcOffsetTop(that.elements);
			}
			that.elements.each(function(i, el) {
				heights.push(bodyHeight);
				$(el).css({
					'z-index': $(that.elements).length - i
				});
				bodyHeight += $(el).height();

				if (i !== 0 && $(document.body).scrollTop() <= that.config.offsetTop) {
					$(el).addClass('sp-fixed').css({
						visibility: 'hidden',
						top: '0',
						left: '0'
					});
				}

			});

			bodyHeight += that.config.offsetTop;
			$(document.body).css({
				height: bodyHeight + 'px'
			});

			model.heights = heights;
			model.bodyHeight = bodyHeight;
		}
		
		this.config.parent = $(this.config.parent)
			.addClass(this.config.wrapClass)
			.css({
				position: 'relative',
		});

		// Wrap target pages
		// if (this.elements.first().parent()[0].tagName === "BODY") {
		// 	this.elements.wrapAll(this.config.parent);
		// } else {
		// 	this.elements.parent().addClass(this.config.wrapClass);
		// }

		calcHeights();
		
		$(window).scroll(function(e) {
			var top = $(window).scrollTop();
			for (var i = 1; i < model.heights.length; i++) {
				if (top  >= model.heights[i] + that.config.offsetTop) {
					that.elements.eq(i).removeClass('sp-fixed');
				} else {
					that.elements.eq(i).addClass('sp-fixed');
				}
				if (top < that.config.offsetTop) {
					$('.sp-fixed').css({visibility: 'hidden'});
				} else {
					$('.page').add('.sp-fixed').css({visibility: 'visible'});
				}
			}
		});

		// IE fix jumpy scroll
		if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
        $('body').on("mousewheel", function () {
            // remove default behavior
            event.preventDefault(); 

            //scroll without smoothing
            var wheelDelta = event.wheelDelta;
            var currentScrollPosition = window.pageYOffset;
            window.scrollTo(0, currentScrollPosition - wheelDelta);
        });
}
	};

	$.fn.stackpage = function(options) {
		new Stackpage(this, options);
		return this;
	};

})(jQuery, window);