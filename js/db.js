let db;

function openDB(callback, error) {
	let openDataBaseRequest = window.indexedDB.open('watchflix_db', 2);
	openDataBaseRequest.onerror = function(event) {
		console.log(event);
		error(event);
	}

	openDataBaseRequest.onsuccess = function(event) {
		console.log(event);
		db = event.target.result;
		callback(event);
	}

	openDataBaseRequest.onupgradeneeded = function(event) {
		console.log(event);
		let database = event.target.result;
		database.createObjectStore('watched', { keyPath : 'videoId'});
	}
}

function checkIfWatched(videoId, callback) {
	if(videoId == null)
		return;

	let objectStore = db.transaction('watched').objectStore('watched');
	let request = objectStore.get(videoId);

	request.onsuccess = function(event) {

		let result = event.target.result;
		if(result)
			callback(true);
		else
			callback(false);
	}
}

function removeFromWatched(videoId, callback) {
	let objectStore = db.transaction('watched', 'readwrite').objectStore('watched');

	objectStore.delete(videoId).onsuccess = function(event) {
		console.log(event.target.result);
		callback(event);
	}
}

function addToWatched(videoInfo, callback) {
	let objectStore = db.transaction('watched', 'readwrite').objectStore('watched');

	objectStore.add(videoInfo).onsuccess = function(event) {
		console.log(event.target.result);
		callback(event);
	}	
}

function getAll(callback) {
	let objectStore = db.transaction('watched').objectStore('watched');

	objectStore.openCursor().onsuccess = function(event) {
		let cursor = event.target.result;

		while(cursor) {
			console.log(cursor);
			cursor.continue();
		}
	}
}