var urlbucket  = {},
    links = [],
    indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
urlbucket.indexedDB = {};
urlbucket.indexedDB.db = null;
urlbucket.indexedDB.getAllUrls = function () {

};

urlbucket.indexedDB.open = function () {
	var request = indexedDB.open("url_bucket",
			"This is the offline version of your tweet-reader bookmarks.");

	request.onsuccess = function (e) {
		urlbucket.indexedDB.db = e.target.result;
		var version = "1.0",
		    db = urlbucket.indexedDB.db,
		    setVrequest;

		if (version !== db.version) {
			setVrequest = db.setVersion(version);

			setVrequest.onfailure = urlbucket.indexedDB.onerror;
			setVrequest.onsuccess = function (e) {
				var store = db.createObjectStore("urls",
						{"keyPath" : "timeStamp"});
			};
		}
		urlbucket.indexedDB.getAllUrls();
	};

	request.onfailure = urlbucket.indexedDB.onerror;
};

urlbucket.indexedDB.showBucketContents = function () {
	var db = urlbucket.indexedDB.db,
	    trans = db.transaction(["urls"], IDBTransaction.READ_WRITE, 0),
	    store = trans.objectStore("urls"),
	    keyRange = IDBKeyRange.lowerBound(0),
	    cursorRequest = store.openCursor(keyRange),
	    bucket = document.createElement('div'),
	    link_list = document.createElement('ul');

	cursorRequest.onsuccess = function (e) {
		var result = e.target.result,
		    link = document.createElement('li');
		if (!!result === false) {
			return;
		}
		link.innerHTML = result.value.link;
		link_list.appendChild(link);
		result.continue();
	};
	bucket.appendChild(link_list);
	document.body.appendChild(bucket);
};

function updateUrlDisplayCount() {
	var db = urlbucket.indexedDB.db,
	    trans = db.transaction(["urls"], IDBTransaction.READ_WRITE, 0),
	    store = trans.objectStore("urls"),
	    keyRange = IDBKeyRange.lowerBound(0),
	    cursorRequest = store.openCursor(keyRange),
	    count = 0;

	cursorRequest.onsuccess = function (e) {
		var result = e.target.result;
		if (!!result === false) {
			return;
		}
		count += 1;
		result.continue();
	};
	cursorRequest.onerror = urlbucket.indexedDB.onerror;
}

urlbucket.indexedDB.addUrl = function (link) {
	var db = urlbucket.indexedDB.db,
	    trans = db.transaction(["urls"], IDBTransaction.READ_WRITE, 0),
	    store = trans.objectStore("urls"),
	    request = store.put({
			"link": link,
			"timeStamp": new Date().getTime()
	    });

	request.onsuccess  = function (e) {
		updateUrlDisplayCount();
	};

	request.onerror = function (e) {
		console.log("failed to add link to indexDB object store." +
				" Show a message using notifications api");
	};
};

function handleDragEnter(e) {
	this.style.border = "2px dotted black";
}

function handleDragLeave(e) {
	this.style.border = "";
}

function handleDragover(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this);
	return false;
}

function handleDragStart(e) {
	console.log(this.tagName);
}

function handleDrop(e) {
	var droppedData = e.dataTransfer.getData('text/html');
	if (e.stopPropagation) {
		e.stopPropagation();
	}
	links.push(droppedData);
	urlbucket.indexedDB.addUrl(droppedData);
	this.innerHTML = links.length + ' urls in bucket';
	return false;
}

function handleDragEnd(e) {
	var bucket = document.getElementById('url_bucket');
	bucket.style.border = "";
}


function addEventListeners() {
	var links = document.getElementsByTagName('a'),
	    bucket = document.getElementById('url_bucket');
	[].forEach.call(links, function (link) {
		link.addEventListener('dragstart', handleDragStart, false);
	});
	bucket.addEventListener('dragenter', handleDragEnter, false);
	bucket.addEventListener('dragleave', handleDragLeave, false);
	bucket.addEventListener('dragover', handleDragover, false);
	bucket.addEventListener('drop', handleDrop, false);
	bucket.addEventListener('dragend', handleDragEnd, false);
}

function createBucket() {
	var div = document.createElement('div');

	//element styles
	div.style.position = "fixed";
	div.style.right = "0px";
	div.style.bottom = "0px";
	div.style.padding = "2px";
	div.style.height = "100px";
	div.style.width = "100px";
	div.style.backgroundColor = "#aaa";
	div.style.zIndex = "1000";
	div.style.webkitBorderRadius = "10px";

	//element classname 
	div.id = 'url_bucket';

	document.body.appendChild(div);
}

function showBucketContent() {
	var openBucket = document.createElement('div'),
	    bucketContent = '';

	links.forEach(function (link) {
		bucketContent += link + '<br>';
	});
	openBucket.innerHTML = bucketContent;
	document.body.appendChild(openBucket);
}

function init() {
	urlbucket.indexedDB.open();
	createBucket();
	addEventListeners();
}
