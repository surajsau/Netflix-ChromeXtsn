// list of video ids in string format separated by ':'
let watched_json = {};

// on document ready
$(function(){
	// fetch the list of video ids saved in chrome local storage
	chrome.storage.local.get(['netflix_watched_list'], function(result){
		let watched = result.netflix_watched_list || "{}";
		console.log(watched);

		watched_json = JSON.parse(watched);
		checkForSliderItem($('.mainView'));
	});

	// run the main function after 5 seconds (assuming internet is little slow also)
	setTimeout(() => {
		main();
	}, 5000);
});

$(document).on('click', '.watch-button', function(){
	let clicked_video_id = $('.watch-button').attr('videoId');
	console.log(clicked_video_id);

	if(clicked_video_id && clicked_video_id.length > 0) {
		if(watched_ids.includes(clicked_video_id)) {
			// add video id to list
			watched_ids = watched_ids.replace(":" + clicked_video_id, "");
		} else {
			// add video id to list
			watched_ids = watched_ids + ":" + clicked_video_id;
		}

		// save updated list of video ids to local storage
		chrome.storage.local.set({saved_ids: watched_ids}, function(){
				chrome.storage.local.get(['saved_ids'], function(result){
					watched_ids = result.saved_ids;

					let parent_container = $('.watch-button').parent('.jawbone-actions');
					$('.watch-button').remove();

					appendWatchButton(parent_container, clicked_video_id);
				});
			});
	}
});

function checkForSliderItem(element) {
	$('.slider-item')
		.add(element)
		.filter(function(index, element) {
			return $(element).attr('class').match(/slider-item-\d+/);
		})
		.each(function(index, element) {
			checkStatusOfSliderItem($(element), '.ptrack-content')
		});
}

function checkStatusOfSliderItem(element, insert_parent_class) {
	let videoId = getVideoId(element);

	let insert_parent = element.find(insert_parent_class);

	if(checkVideoIsWatched(videoId = videoId)) {
		let isAlreadyLabeled = element.children().hasClass('watched-span-container');
		
		if(!isAlreadyLabeled)
			return;

		$(insert_parent).prepend(
			`
				<div class="watched-span-container">
					<span class="watched-span">Watched</span>
				</div>
			`);
	} else {
		$(insert_parent).remove('.watched-span-container');
	}
}

function checkVideoIsWatched(videoId) {
	return watched_json.hasOwnProperty(videoId);
}

/*
	ptrack-content div contains an attribute 'data-ui-tracking-context'
	which contains the information regarding video_id of the element.
	It's a url-encoded JSON string.
*/
function getVideoId(element) {
	let ptrack_content = $(element).find('.ptrack-content');
	if(ptrack_content && ptrack_content.length > 0) {
		let tracking_data = ptrack_content.attr('data-ui-tracking-context');
		let decoded_tracking_data = decodeURIComponent(tracking_data);

		let decoded_tracking_json = JSON.parse(decoded_tracking_data);

		// some attribute values have 'videoId' and some have 'video_id'
		return decoded_tracking_json.videoId || decoded_tracking_json.video_id;
	}
}

const debouncedRateAll = _.partial(_.debounce(checkForSliderItem, 1000), $('.mainView'));

function main() {

	addWatchedListButton();
	
	addSliderObservers();

	addJawboneObserver();

	addBobObserver();

	checkForSliderItem($('.mainView'));

  	$(window).resize(debouncedRateAll);
  	$(window).scroll(debouncedRateAll);

}

/*
	Adds 'Watched List' button to Netflix tabs at the top
*/
function addWatchedListButton() {
	console.log('addWatchedListButton');
	let watched_list_page_link = chrome.extension.getURL('watched_list/index.html');
	$('.tabbed-primary-navigation').append(
		`
			<li class="navigation-tab"><a href="${watched_list_page_link}" bis_skin_checked="1">Watched</a></li>
		`
		);
}

/*
	This is the observer set on each 'un-interacted' element in the list.
*/
function addSliderObservers() {
	$('.sliderContent').observe('added', '.slider-item', function(record){
		checkForSingleItem(this, '.ptrack-content')
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

		console.log(videoId);

		appendWatchButton(action_container, videoId);
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

/*
	Appending an extra button showing Watch status of the iteme, to jawBone container
*/
function appendWatchButton(container, videoId) {
	let isVideoWatched = checkVideoIsWatched(videoId);

	// these are predefined netflix class ids which are already used on the 'Play' and 'Add to List' buttons
	let a_class = isVideoWatched ? 'nf-flat-button-primary' : 'mylist-button';

	let button_text = isVideoWatched ? 'Watched' : 'Add to Watched';
	
	// these are the predefined icons already used on the 'Play' and 'Add to List' buttons
	let button_icon_class = isVideoWatched ? 'nf-flat-button-icon-mylist-added' : 'nf-flat-button-icon-mylist-add';

	let appended_html = `
				<a class="watch-button nf-icon-button nf-flat-button ${a_class} nf-flat-button-uppercase"  videoId="${videoId}">
					<span class="nf-flat-button-icon ${button_icon_class}"></span>
					<span class="nf-flat-button-text">${button_text}</span>`

	$(container).append(appended_html);
}