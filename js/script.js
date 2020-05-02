'use strict';

// on document ready
$(function(){
	
	extractChromeStorage(function () {
		// run the main function after 5 seconds (assuming internet is little slow also)
		setTimeout(function() {

			addNewTabOption(chrome.extension.getURL('watched_list/index.html'), "Watched");

			addSliderObservers();

			addJawboneObserver();

			addBobObserver();

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

/*
	This is the observer on the view which shows up upon hovering on an
	item from the list.
*/
function addBobObserver() {
	$('.bob-container').observe('added', '.bob-actions-wrapper', function(record){
		let action_button_container = $(this).find('.ActionButtons');
		let videoId = getVideoId(action_button_container);

		$(action_button_container).append(
			`
			<div class="nf-svg-button-wrapper">
				<a class="nf-svg-button simpleround">
					<svg class="svg-icon" focusable="true">
						<use xlink:href="#images/add_to_watch"></use>
					</svg>
				</a>
			</div>
			`
			);
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
	let isVideoWatched = checkVideoIsWatched(videoId);

	if(isVideoWatched) {
		let isLabeled = isAlreadyLabeled(element);
		
		if(!isLabeled)
			return;

		addWatchedLabel(element);
		
	} else {
		removeWatchedLabel(element);
	}
}

