/* Copyright © 2016 Fateh Khalsa */
/* Main Codefile */

/* Global Variables */
var PAGESCROLL_DISABLED = false;
var PAGESCROLL_TIMEOUT_ID;
var PAGESCROLL_ANIMATION_SPEED = 850;

/* Plugins */
(function ($) {
    $.fn.coversXPercentageOfViewport = function(x){
		var offsetFromViewport = Math.abs($(this).offset().top - $(window).scrollTop());
		var minimumOffset = $(window).height() * Math.abs(x - 1.0);
		return (offsetFromViewport <= minimumOffset);
    };
})(jQuery);

/* Page-Template Code */
// On page load:
_scrollToPage($('.page').first());		// Scroll to first page
$('.page').addClass('visible');			// Fade in page content

// Set page height to fill viewport
_setPageHeights();

$(window).resize(function(event) {
	_setPageHeights();
});

function _setPageHeights() {
	var viewportHeight = $(window).height();
	if (_screenSizeIsMDAndUp()) {
		$('.page').height(viewportHeight);
	}
	else {
		$('.page').css('height', 'auto');
		$('.page').each(function(i, page) {
			var currentPageHeight = $(page).height();
			var newPageHeight = Math.max(viewportHeight, currentPageHeight);
			$(page).height(newPageHeight);
		});
	}
}

// Handle window scrolling
$(window).scroll(function(event) {
	$('.page').each(function(i, page) {
		if ($(page).coversXPercentageOfViewport(0.5) && !$(page).hasClass('current-page')) {
			if (_screenSizeIsMDAndUp()) {
				// Scroll page into full view, and set current page (animate backgrounds, etc)
				clearTimeout(PAGESCROLL_TIMEOUT_ID);
				PAGESCROLL_TIMEOUT_ID = setTimeout(_scrollToPage.bind(null, $(page)), 100);
			}
			else {
				// Set current page (animate backgrounds, etc)
				_setCurrentPage($(page));
			}
			return false;
		}
	});
	// Set selected nav button on scroll
	var $currentPage = $('.page.current-page');
	$('.navbar li').removeClass('selected');
	$('.navbar li[data-nav-page='+$currentPage.attr('id')+']').addClass('selected');
	// Fade background with scroll
	// var pageVisibilityPercentage = ($('.page.current-page').offset().top - $(window).scrollTop()) / $(window).height();
	// var currentPageVisibilityPercentage = Math.abs((pageVisibilityPercentage - 0.5) * 2);
	// var currentPageOffsetPercentage = Math.abs(currentPageVisibilityPercentage - 1);
	// var opacity = ((currentPageOffsetPercentage * 0.2) + 0.2).toFixed(2);
	// $('.page').css('background-color', 'rgba(0, 0, 0, '+opacity+')');
});

// Scroll nav-page to top
$('.navbar').click(function(event) {
	var $this = $(event.target);
	if ($this.is('li')) {
		var $page = $('#'+$this.data('nav-page'));
		_scrollToPage($page)
	}
});

// Scroll to home on title click
$('.title').click(function(event) {
	_scrollToPage($('.page').first());
});

// Scroll to next page button
$('#next-page-button').click(function(event) {
	_scrollToPage($('.page.current-page').next('.page'));
});

// Page scrolling utilities
function _scrollToPage($page) {
	if (!PAGESCROLL_DISABLED) {
		$('html, body').animate({scrollTop: $page.offset().top}, PAGESCROLL_ANIMATION_SPEED);
		_setCurrentPage($page);
	}
	// Disable page scrolling temporarily - prevents infinite scroll loop
	PAGESCROLL_DISABLED = true;
	setTimeout(_enablePageScroll, PAGESCROLL_ANIMATION_SPEED);
}

function _enablePageScroll() {
	PAGESCROLL_DISABLED = false;
}

function _setCurrentPage($page) {
	$('.page').removeClass('current-page');
	$page.addClass('current-page');
	if ($page.attr('id') == $('.page').last().attr('id')) {
		$('#next-page-button').addClass('disabled');
	}
	else {
		$('#next-page-button').removeClass('disabled');
	}
}

/* Media query helper functions */
function _screenSizeIsSMAndUp() { return ($('.media-query-trigger-sm').css('float') == 'none'); }
function _screenSizeIsMDAndUp() { return ($('.media-query-trigger-md').css('float') == 'none'); }
function _screenSizeIsLGAndUp() { return ($('.media-query-trigger-lg').css('float') == 'none'); }
function _screenSizeIsXLAndUp() { return ($('.media-query-trigger-xl').css('float') == 'none'); }

/* Utility functions - for development */
function log(argument) { console.log(argument); }