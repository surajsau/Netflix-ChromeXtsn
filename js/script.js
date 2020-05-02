'use strict';

// on document ready
$(function(){
	
	extractChromeStorage(function () {
		// run the main function after 5 seconds (assuming internet is little slow also)
		setTimeout(function() {

			checkForSliderItem();

			addNewTabOption(chrome.extension.getURL('watched_list/index.html'), "Watched");

			addSliderObservers();

			addJawboneObserver();

		  	$(window).resize(debouncedCheckForSliderItem);
		  	$(window).scroll(debouncedCheckForSliderItem);


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

const debouncedCheckForSliderItem = _.partial(_.debounce(checkForSliderItem, 1000), $('.mainView'));

/*
	This is the observer set on each 'un-interacted' element in the list.
*/
function addSliderObservers() {
	$('.sliderContent').observe('added', '.slider-item', function(record){
		checkStatusOfSliderItem($(this));
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

function checkForSliderItem() {
	$('.slider-item')
		.add('.mainView')
		.filter(function(index, element) {
			return $(element).attr('class').match(/slider-item-\d+/);
		})
		.each(function(index, element) {
			checkStatusOfSliderItem($(element), '.ptrack-content');
		});
}

function checkStatusOfSliderItem(element) {

	let videoId = getVideoId(element);

	if(check(videoId)) {
		let isLabeled = isAlreadyLabeled(element);
		let watchedLabelHtml = `
			<div class="watched-span-container">
				<span class="watched-span">Watched</span>
			</div>`;

		if(!isLabeled)
			element.prepend(watchedLabelHtml);
	} else {
		element.remove('.watched-span-container')
	}
}

