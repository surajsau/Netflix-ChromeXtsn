
/*
	Adds 'Watched List' button to Netflix tabs at the top
*/
function addNewTabOption(link, title) {
	$('.tabbed-primary-navigation').append(
		`
			<li class="navigation-tab"><a class="tab-watched" bis_skin_checked="1" href="${link}">${title}</a></li>
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
	console.log(element);
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









function renderContainer(videoItems) {
    let count = 0

    videoItems.forEach(function(item, index, arr) {
    	let rowIndex = Math.floor(count/ROW_SIZE);
        if(count % ROW_SIZE == 0)
            renderRow($('.mainView'), rowIndex);

        let videoItem = {video_id: item.videoId, video_image: item.image, video_title: item.title};

        console.log(videoItem);
        console.log(item);

        renderSliderItem($('#row-' + rowIndex).find('.sliderContent'), videoItem, index);

        count++;

        console.log(rowIndex + ": " + count);
    });
    for(videoItem in videoItems) {
        
    }
	
}

function renderRow(container, row_index) {
	container.append(
		`<div class="rowContainer rowContainer_title_card" id="row-${row_index}" bis_skin_checked="1">
            <div class="ptrack-container" bis_skin_checked="1">
                <div class="rowContent slider-hover-trigger-layer" bis_skin_checked="1">
                    <div class="slider" bis_skin_checked="1">
                        <div class="sliderMask showPeek" bis_skin_checked="1">
                            <div class="sliderContent row-with-x-columns" bis_skin_checked="1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
		);
}

function renderSliderItem(row_container, item, item_index) {
	row_container.append(
		`
			<div class="slider-item slider-item-${item_index}">
                <div class="title-card-container">
                    <div class="slider-refocus title-card">
                        <div class="ptrack-content">
                            <a href="${NETFLIX_BASE_URL}/watch/${item.video_id}" role="link" aria-label="Ozark" tabindex="0" aria-hidden="false" class="slider-refocus">
                                <div class="boxart-size-16x9 boxart-container"><img class="boxart-image boxart-image-in-padded-container" src="${item.video_image}" alt="" />
                                    <div class="fallback-text-container" aria-hidden="true">
                                        <p class="fallback-text">${item.video_title}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
		`
		);
}

