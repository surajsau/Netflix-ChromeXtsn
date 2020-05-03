
/*
	Adds 'Watched List' button to Netflix tabs at the top
*/
function addNewTabOption(link, title) {
	$('.tabbed-primary-navigation').append(
		`
			<li class="navigation-tab"><a href="${link}" bis_skin_checked="1">${title}</a></li>
		`
		);
}

function isAlreadyLabeled(element) {
	return element.children().hasClass('watched-span-container');
}

function isWatchButtonAlreadyAdded(element) {
	return element.children().hasClass('jawbone-watch-button');
}

function addWatchedLabel(element) {
	$(element)
		.prepend(
		`
			<div class="watched-span-container">
				<span class="watched-span">Watched</span>
			</div>
		`);
}


function removeWatchedLabel(element) {
	$(element).remove('.watched-span-container');
}

/*
	Appending an extra button showing Watch status of the iteme, to jawBone container
*/
function appendWatchButton(container_element, videoInfo, isVideoWatched) {

	let buttonColor = getWatchButtonBackgroundColor(isVideoWatched);

	let buttonText = getWatchButtonText(isVideoWatched);
	
	// these are the predefined icons already used on the 'Play' and 'Add to List' buttons
	let buttonIconPath = getWatchButtonIcon(isVideoWatched);

	// <button aria-label="Remove from My List" class="button-secondary opacity-60 medium hasLabel ltr-14a0la9" data-uia="add-to-my-list-added" type="button">
	// <div class="icon ltr-1e4713l">
	// <div class="medium ltr-sar853" role="presentation">
	// <svg viewBox="0 0 24 24">
	// <path fill="currentColor" d="M3.707 12.293l-1.414 1.414L8 19.414 21.707 5.707l-1.414-1.414L8 16.586z"></path></svg>
	// </div>
	// </div>
	// <div class="ltr-1i33xgl" style="width: calc(0.72rem);"></div>
	// <span class="ltr-18i00qw">My List</span></button>

	let appended_html = `
				<button class="jawbone-watch-button button-watch-list" type="button" videoId="${videoInfo}" type="button" style="background-color:${buttonColor}">
					<div class="icon ltr-1e4713l">
						<div class="medium ltr-sar853" role="presentation">
							<svg viewBox="0 0 24 24">
								<path d="${buttonIconPath}" fill="currentColor"></path>
							</svg>
						</div>
					</div>
					<div class="ltr-1i33xgl" style="width: calc(0.72rem);"></div>
					<span class="ltr-18i00qw button_text_span">${buttonText}</span>
				</button>`

	$(container_element).prepend(appended_html);
}

function addLabel(element) {
	let watchedLabelHtml = `
			<div class="watched-span-container">
				<span class="watched-span">Watched</span>
			</div>`;

	element.prepend(watchedLabelHtml);
}

function removeLabel(element) {
	element.remove('.watched-span-container')
}

function changeWatchButtonAppearance(element, isVideoWatched) {
	element.css('background-color', getWatchButtonBackgroundColor(isVideoWatched));
	element.find('span').html(getWatchButtonText(isVideoWatched));
	element.find('path').attr('d', getWatchButtonIcon(isVideoWatched));
}

function getWatchButtonBackgroundColor(isVideoWatched) {
	return isVideoWatched ? 'rgba(229, 9, 20, 1.0)' : 'rgba(133, 133, 133, 0.6)';
}

function getWatchButtonText(isVideoWatched) {
	return isVideoWatched ? 'Watched' : 'Add to Watched';
}

function getWatchButtonIcon(isVideoWatched) {
	return isVideoWatched ? 'M3.707 12.293l-1.414 1.414L8 19.414 21.707 5.707l-1.414-1.414L8 16.586z' : 'M13 11h8v2h-8v8h-2v-8H3v-2h8V3h2v8z';
}



