const NETFLIX_BASE_URL = "https://www.netflix.com";

// fetch the list of video ids saved in chrome local storage
chrome.storage.local.get(['watched'], function(result){
	let watched = result.watched || "{}";
	console.log(watched);

    let watched_json = JSON.parse(watched);
	renderContainer(watched_json);
});


function renderContainer(rows) {
	rows.forEach(function(item, index){
		renderRow($('.galleryLockups'), item, index);
	});
}

function renderRow(container, row, row_index) {
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

	row.items.forEach(function(item, index){
		var row_id = '#row-' + row_index;
		renderSliderItem($(row_id).find('.sliderContent'), item, index);
	});
}

function renderSliderItem(row_container, item, item_index) {
	row_container.append(
		`
			<div class="slider-item slider-item-${item_index}">
                <div class="title-card-container">
                    <div class="slider-refocus title-card">
                        <div class="ptrack-content">
                            <a href="${NETFLIX_BASE_URL}/watch/${item.video_id}" role="link" aria-label="Ozark" tabindex="0" aria-hidden="false" class="slider-refocus">
                                <div class="boxart-size-16x9 boxart-container"><img class="boxart-image boxart-image-in-padded-container" src="${item.image_url}" alt="" />
                                    <div class="fallback-text-container" aria-hidden="true">
                                        <p class="fallback-text">${item.video_title}</p>
                                    </div>
                                </div>
                                <div class="click-to-change-JAW-indicator">
                                    <div class="bob-jawbone-chevron">
                                        <svg class="svg-icon svg-icon-chevron-down" focusable="true">
                                            <use filter="" xlink:href="#chevron-down"></use>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="bob-container"><span></span></div>
                    </div>
                </div>
            </div>
		`
		);
}