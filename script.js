let watched_ids = ""

$(function(){
	chrome.storage.local.get(['saved_ids'], (result) => {
		watched_ids = result.saved_ids || "";
		console.log(watched_ids);
	});
	setTimeout(() => {
		main();
	}, 5000);
});

$(document).on('click', '.watch-button', () => {
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

		chrome.storage.local.set({saved_ids: watched_ids}, () => {
				chrome.storage.local.get(['saved_ids'], (result) => {
					watched_ids = result.saved_ids;
					console.log(watched_ids);

					let parent_container = $('.watch-button').parent('.jawbone-actions');
					$('.watch-button').remove();

					appendWatchButton(parent_container, clicked_video_id);
				});
			});
	}
});

function checkVisibleItem(element) {
	let base = $('.slider-item').add(element);

	base.filter((index, element) => {
		return $(element).attr('class').match(/slider-item-\d+/);
	}).each((index, element) => {
		checkForSingleItem(element, '.ptrack-content')
	});
}

function checkForSingleItem(element, insert_item_class) {
	let videoId = getVideoId(element);

	let insert_parent = $(element).find(insert_item_class);

	if(checkVideoIsWatched(videoId)) {

		if($(insert_parent).find('.span-container').length > 0) {
			return;
		}

		$(element).find(insert_item_class).append(
			`
				<div class="span-container">
					<span class="watched-span">Watched</span>
				</div>
			`);
	} else {

		if($(insert_parent).find('.span-container').length > 0) {
			$(insert_parent).remove('.span-container');
		}
	}
}

const debouncedRateAll = _.partial(_.debounce(checkVisibleItem, 1000), $('.mainView'));

function main() {
	
	// addSliderObservers();

	addJawboneObserver();

	checkVisibleItem($('.mainView'));
  	$(window).resize(debouncedRateAll);
  	$(window).scroll(debouncedRateAll);

  	// $('.mainView').observe('added', '.sliderContent', addSliderObservers)
}

function addSliderObservers() {
	$('.sliderContent')
	.observe('added', '.slider-item', function(record){
		checkForSingleItem(this, '.ptrack-content')
	});
}

function addJawboneObserver() {
	$('.mainView').observe('added', '.jawBone', function(record){
		let action_container = $(this).find('.jawbone-actions');
		let videoId = getVideoId(action_container);

		appendWatchButton(action_container, videoId);
	});
}

function appendWatchButton(container, videoId) {
	if(checkVideoIsWatched(videoId)) {
		$(container).append(
			`
				<a class="watch-button nf-icon-button nf-flat-button nf-flat-button-primary nf-flat-button-uppercase" videoId="` + videoId + `">
					<span class="nf-flat-button-icon nf-flat-button-icon-mylist-added"></span>
					<span class="nf-flat-button-text">Watched</span>
				</a>
			`);
	} else {
		$(container).append(
			`
				<a class="watch-button nf-icon-button nf-flat-button mylist-button nf-flat-button-uppercase"  videoId="` + videoId + `">
					<span class="nf-flat-button-icon nf-flat-button-icon-mylist-add"></span>
					<span class="nf-flat-button-text">Add to Watched</span>
				</a>
			`);
	}
}

function checkVideoIsWatched(videoId) {
	return watched_ids.includes(videoId);
}

function getVideoId(element) {
	let ptrack_content = $(element).find('.ptrack-content');
	if(ptrack_content && ptrack_content.length > 0) {
		let tracking_data = ptrack_content.attr('data-ui-tracking-context');
		let decoded_tracking_data = decodeURIComponent(tracking_data);

		let decoded_tracking_json = JSON.parse(decoded_tracking_data);

		return decoded_tracking_json.videoId || decoded_tracking_json.video_id;
	}
}