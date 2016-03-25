/* Copyright © 2016 Fateh Khalsa */
/* Main Codefile */

/* Global Variables */
var PAGESCROLL_DISABLED = false;
var PAGESCROLL_TIMEOUT_ID;
var PAGESCROLL_ANIMATION_SPEED = 850;

/* Plugins */
$.getScript('/js/jquery.isOnScreen.min.js');

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
	$('.page').height(viewportHeight);
}

// Handle window scrolling
$.getScript('/js/jquery.isOnScreen.min.js', function() {
	$(window).scroll(function(event) {
		// Scroll page into full view
		$('.page').each(function(i, page) {
			if ($(page).isOnScreen(1.0, 0.5) && !$(page).hasClass('current-page')) {
				clearTimeout(PAGESCROLL_TIMEOUT_ID);
				PAGESCROLL_TIMEOUT_ID = setTimeout(_scrollToPage.bind(null, $(page)), 100);
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
		$('.page').removeClass('current-page');
		$page.addClass('current-page');
		if ($page.attr('id') == $('.page').last().attr('id')) {
			$('#next-page-button').addClass('disabled');
		}
		else {
			$('#next-page-button').removeClass('disabled');
		}
	}
	// Disable page scrolling temporarily - prevents infinite scroll loop
	PAGESCROLL_DISABLED = true;
	setTimeout(_enablePageScroll, PAGESCROLL_ANIMATION_SPEED);
}

function _enablePageScroll() {
	PAGESCROLL_DISABLED = false;
}

/* Utility functions */		// TODO: remove before release
function log(argument) { console.log(argument); }