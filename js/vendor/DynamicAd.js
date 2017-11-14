function DynamicAd() {
	console.log('DynamicAd');
	var api = {

	}

	api.onready = function(){};


	api.init = function(){
		if(window.previewData){
			renderData();
		}
	}

	function renderData(){
		var images = [];
		var svgs = [];
		
		for(var key in previewData){
			
			if(key == 'label' || key == 'dimensions') continue;
			
			var value = previewData[key];

			console.log(key, value);
			
			if(key == 'clickTag') window.clickTag = value;

			if(inferType(value) == 'image') {
				var element = document.getElementById(key);
				if(!element) {
					console.log('DynamicAd Error: Could not bind "' + key + '" to element.');
					continue
				}
				if(element.tagName == 'IMG') element.src = value;
				if(element.tagName == 'DIV') element.style.backgroundImage = 'url('+value+')';
				images.push(value);
			}

			if(inferType(value) == 'svg') {
				var element = document.getElementById(key);
				if(!element) {
					console.log('DynamicAd Error: Could not bind "' + key + '" to element.');
					continue
				}
				if(element.tagName == 'IMG') { 
					images.push(value);
					element.src = value;
				}
				if(element.tagName == 'DIV') {
					svgs.push({
						key: key,
						value: value
					});
				}
			}
			
			if(inferType(value) == 'string') {
				var element = document.getElementById(key);
				if(!element) {
					console.log('DynamicAd Error: Could not bind "' + key + '" to element.');
					continue
				}
				element.innerHTML = value;
			}

		}

		console.log('rendering', key, value);

		loadSVGs(svgs, function(){
			loadImages(images, function(){
				renderTemplateStrings();

				api.onready(api);
			});
		})
	}

	function renderTemplateStrings(){
		var html = String(document.body.innerHTML);
		for(var key in previewData){
			var value = previewData[key]
			html = html.replace(new RegExp('{{'+key+'}}','g'), value);
		}

		document.body.innerHTML = html;
	}

	function renderTemplateStringsSrc(src){
		var html = src;
		for(var key in previewData){
			var value = previewData[key]
			html = html.replace(new RegExp('{{'+key+'}}','g'), value);
		}

		return html;
	}

	function loadImages(images, callback){
		if(images.length == 0) {
			callback();
			return;
		}

		var imageCount = images.length;
		var imagesLoaded = 0;

		for(var i=0; i<imageCount; i++){
			var imageElement = document.createElement('img');
			imageElement.src = images[i];

			document.getElementById('image-loader').appendChild(imageElement);
		    imageElement.onload = function(){
		        imagesLoaded++;
		        if(imagesLoaded == imageCount){
		        	console.log('image loaded', images[i]);
		            callback();
		        }
		    }
		}
	}

	function loadSVGs(svgs, callback){
		if(svgs.length == 0) callback();

		var svgCount = svgs.length;
		var svgsLoaded = 0;

		for(var i=0; i<svgCount; i++){

			var svg = svgs[i];
			svg.element = document.getElementById(svg.key);

			getDocument(svg.value, function(text){
				this.html = text;
				this.element.innerHTML = renderTemplateStringsSrc('<svg '+text.split('<svg ')[1]);

				svgsLoaded++;
				if(svgsLoaded == svgCount) {
					callback();
				};

			}.bind(svg));
		}
	}

	function inferType(element){
		console.log('infer', element);
		if(element.indexOf('.jpg') > -1 || element.indexOf('.png') > -1 || element.indexOf('.gif') > -1) {
			return 'image';
		}

		if(element.indexOf('.svg') > -1) {
			return 'svg'
		}

		if(element.indexOf('http://') > -1 || element.indexOf('https://') > -1) {
			return 'url';
		}

		return 'string';
	}

	function getDocument(url, callback) {  
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		        callback(xmlhttp.responseText);
		    }
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	return api;
}