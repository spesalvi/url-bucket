var links = [];

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
	div.style.backgroundColor = "gold";
	div.style.zIndex = "1000";

	//element classname 
	div.id = 'url_bucket';

	document.body.appendChild(div);
}

function showBucketContent() {
	var openBucket = document.createElement('div'),
	    bucketContent = '';

	links.forEach(function(link) {
			bucketContent += link + '<br>';
			});
	openBucket.innerHTML = bucketContent;
	document.body.appendChild(openBucket);
}

function init() {
	createBucket();
	addEventListeners();
}
