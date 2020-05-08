'use strict';

const ROW_SIZE = 6;
const NETFLIX_BASE_URL = "https://www.netflix.com";

// on document ready
$(function(){

	// addNewTabOption("#watched", "Watched");

	$('.pinning-header').after(`<div class="watched-container grid"></div>`);

	openDB(function(success) {
		
		// run the main function after 5 seconds (assuming internet is little slow also)
		setTimeout(function() {

			checkForSliderItem($('.mainView'));

			addSliderObservers();

			addJawboneObserver();

		}, 5000);

	}, function(error) {})

	// extractChromeStorage(function () {
		
	// });
});

$(document).on('click', '.button-watch-list', function() {
	let button = $(this);
	let videoId = getButtonVideoId(button);

	checkIfWatched(videoId, function(isWatched) {
		if(isWatched) {
			removeFromWatched(videoId, function(event) {
				changeWatchButtonAppearance(button, false);
			});
			// removeFromWatchedList(videoId);
		} else {
			let videoInfo = fetchVideoDetailsFromFocusedCard();
			videoInfo.videoId = videoId;

			addToWatched(videoInfo, function(event) {
				changeWatchButtonAppearance(button, true);
			});
			// addToWatchedList(videoId, videoInfo);
		}

		// changeWatchButtonAppearance($(this), !isVideoWatchedCurrently);
	});

});

$(document).on('click', '.tab-watched', function() {
	$('.watched-container').toggleClass('expand');

	getAllWatched(function(result) {
		renderContainer(result);
	});
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

		checkIfWatched(videoId, function(isWatched) {
			$('.jawBoneContainer .jaw-play-hitzone').css('width', '25%');

			appendWatchButton(actionButtonContainer, videoId, isWatched);
		});
		
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

	checkIfWatched(videoId, function(isWatched) {
		if(isWatched) {

			if(!isAlreadyLabeled(element))
				addLabel(element);
		} else {
			removeLabel(element);
		}
	});

}

