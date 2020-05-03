const NETFLIX_BASE_URL = "https://www.netflix.com";

const ROW_SIZE = 6;

// fetch the list of video ids saved in chrome local storage

openDB(function(success) {

    getAll(function(result) {
        console.log(result);
    });
});


function renderContainer(videoItems) {
    let count = 0
    for(videoId in videoItems) {
        let videoItem = videoItems[videoId];

        let rowIndex = Math.floor(count/ROW_SIZE);
        if(count % ROW_SIZE == 0)
            renderRow($('.galleryLockups'), rowIndex);

        let item = {video_id: videoId, video_image: videoItem.image, video_title: videoItem.title};

        renderSliderItem($('#row-' + rowIndex).find('.sliderContent'), item, count);

        count++;

        console.log(rowIndex + ": " + count);
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