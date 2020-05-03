'use strict';

// on document ready
$(function(){
	
	extractChromeStorage(function () {
		// run the main function after 5 seconds (assuming internet is little slow also)
		setTimeout(function() {

			checkForSliderItem($('.mainView'));

			addNewTabOption(chrome.extension.getURL('watched_list/index.html'), "Watched");

			addSliderObservers();

			addJawboneObserver();

		}, 5000);
	});
});

$(document).on('click', '.button-watch-list', function() {
	let videoId = getButtonVideoId($(this));
	let isVideoWatchedCurrently = checkVideoIsWatched(videoId);

	if(isVideoWatchedCurrently) {
		removeFromWatchedList(videoId);
	} else {
		let videoInfo = fetchVideoDetailsFromFocusedCard();
		addToWatchedList(videoId, videoInfo);
	}

	changeWatchButtonAppearance($(this), !isVideoWatchedCurrently);

});

/*
	This is the observer set on each 'un-interacted' element in the list.
*/
function addSliderObservers(element) {
	$('.sliderContent')
		.add('.mainView')
		.each(function(index, element) {
			$(element).observe('added', '.slider-item', function(record) {
				checkStatusOfSliderItem($(this));
			});
		});
}

/*
	This is the observer on the dropdown details view of an item when
	selected from the list.
*/
function addJawboneObserver() {
	$('.mainView').observe('added', '.jawBoneContainer .synopsis', function(record){

		let overviewContainer = $(this).parentsUntil('.overview');
		let videoId = getVideoId(overviewContainer);

		var actionButtonContainer = $(this).siblings('.jawbone-actions');

		let isVideoWatched = checkVideoIsWatched(videoId);

		$('.jawBoneContainer .jaw-play-hitzone').css('width', '25%');

		appendWatchButton(actionButtonContainer, videoId, isVideoWatched);
	});
}

function checkForSliderItem(element) {
	$('.slider-item')
		.add(element)
		.filter(function(index, element) {
			return $(element).attr('class').match(/slider-item-\d+/);
		})
		.each(function(index, element) {
			checkStatusOfSliderItem($(element), '.ptrack-content');
		});
}

function checkStatusOfSliderItem(element) {

	if(isAlreadyLabeled(element))
		return;

	let videoId = getVideoId(element);

	if(checkVideoIsWatched(videoId)) {
		addLabel(element);
	} else {
		removeLabel(element);
	}
}

