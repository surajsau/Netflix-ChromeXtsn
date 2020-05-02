
// list of video ids in string format separated by ':'
let watched_list = {};

function extractChromeStorage(callback) {
	chrome.storage.sync.get(['netflix_watched_list'], function(result){
		let watched = result.netflix_watched_list || "{}";
		console.log(watched);

		watched_list = JSON.parse(watched);
		callback();
	});
}

function checkVideoIsWatched(videoId) {
	return watched_list.hasOwnProperty(videoId);
}

function removeFromWatchedList(videoId) {
	delete watched_list[videoId];

	console.log(videoId + ' deleted: ' + JSON.stringify(watched_list));
	chrome.storage.sync.set({netflix_watched_list: JSON.stringify(watched_list)});
}

function addToWatchedList(videoId, videoInfo) {
	watched_list[videoId] = videoInfo;

	console.log(videoId + ' added: ' + JSON.stringify(watched_list));
	chrome.storage.sync.set({netflix_watched_list: JSON.stringify(watched_list)});
}

/*
	ptrack-content div contains an attribute 'data-ui-tracking-context'
	which contains the information regarding video_id of the element.
	It's a url-encoded JSON string.
*/
function getVideoId(element) {
	let ptrackContent = $(element).find('.ptrack-content');
	if(ptrackContent && ptrackContent.length > 0) {
		let tracking_data = ptrackContent.attr('data-ui-tracking-context');
		let decoded_tracking_data = decodeURIComponent(tracking_data);

		let decoded_tracking_json = JSON.parse(decoded_tracking_data);

		// some attribute values have 'videoId' and some have 'video_id'
		return decoded_tracking_json.videoId || decoded_tracking_json.video_id;
	}
}

function getButtonVideoId(element) {
	return element.attr('videoId');
}

function fetchVideoDetailsFromFocusedCard() {
	let ptrackContent = $('.title-card-jawbone-focus').parent();

	let imageContainer = ptrackContent.find('.boxart-container img');
	let titleContainer = ptrackContent.find('.fallback-text-container p');

	let image = imageContainer.attr('src');
	let title = titleContainer.html();

	return {image: image, title: title};
}