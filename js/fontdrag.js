/*
* font dragr v1.5
* http://www.thecssninja.com/javascript/font-dragr
* Copyright (c) 2010 Ryan Seddon
* released under the MIT License
*/
var TCNDDF = TCNDDF || {};

(function(){
var dropContainer,
dropListing,
displayContainer,
domElements,
fontPreviewFragment = document.createDocumentFragment(),
styleSheet,
fontFaceStyle,
persistantStorage = window.localStorage || false,
webappCache = window.applicationCache || window,
contentStorageTimer;

const fontList = new Map();

TCNDDF.setup = function () {
dropListing = document.getElementById("fonts");
dropContainer = document.getElementsByTagName("section")[0];
displayContainer = document.getElementById("custom");
upload = document.getElementById("upload");
styleSheet = document.styleSheets[0];

dropListing.addEventListener("click", TCNDDF.handleFontChange, false);

/* LocalStorage events */
if(persistantStorage) {
displayContainer.addEventListener("keyup", function(){contentStorageTimer = setTimeout("TCNDDF.writeContentEdits('mainContent')",1000);}, false);
displayContainer.addEventListener("keydown", function(){clearTimeout(contentStorageTimer);}, false);

// Restore changed data
TCNDDF.readContentEdits("mainContent");
}

/* DnD event listeners */
dropContainer.addEventListener("dragenter", function(event){TCNDDF.preventActions(event);}, false);
dropContainer.addEventListener("dragover", function(event){TCNDDF.preventActions(event);}, false);
dropContainer.addEventListener("drop", TCNDDF.handleDrop, false);

upload.onchange = (evt) => {
	// console.log('Start upload font');
	TCNDDF.processFiles(evt.target.files);
}

/* Offline event listeners */
webappCache.addEventListener("updateready", TCNDDF.updateCache, false);
webappCache.addEventListener("error", TCNDDF.errorCache, false);
};

TCNDDF.handleDrop = function (evt) {
var dt = evt.dataTransfer,
files = dt.files || false;
TCNDDF.preventActions(evt);
TCNDDF.processFiles(files);
};


TCNDDF.processFiles = function (files) {
// console.log('Start file processing');
var count = files.length,
acceptedFileExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

for (var i = 0; i < count; i++) {
var file = files[i],
droppedFullFileName = file.name,
droppedFileName,
droppedFileSize;

if(droppedFullFileName.match(acceptedFileExtensions)) {
droppedFileName = droppedFullFileName.replace(/\..+$/,""); // Removes file extension from name
droppedFileName = droppedFileName.replace(/\W+/g, "-"); // Replace any non alpha numeric characters with -
droppedFileSize = Math.round(file.size/1024) + "kb";

// Custom Addition by Andras Larsen
document.title = droppedFileName;

TCNDDF.processData(file,droppedFileName,droppedFileSize);
} else {
alert("Invalid file extension. Will only accept ttf, otf, woff or woff2 font files");
}
}
};

TCNDDF.processData = function (file, name, size) {
var reader = new FileReader();
reader.name = name;
reader.size = size;

/*
Chrome 6 dev can't do DOM2 event based listeners on the FileReader object so fallback to DOM0
http://code.google.com/p/chromium/issues/detail?id=48367
reader.addEventListener("loadend", TCNDDF.buildFontListItem, false);
*/
reader.onloadend = function (event) { TCNDDF.buildFontListItem(event); }
reader.readAsDataURL(file);


// var otTables = font.opentype.tables;
// var axes = otTables.fvar.axes;
};

TCNDDF.buildFontListItem = function (event) {
domElements = [
document.createElement('li'),
document.createElement('span'),
document.createElement('span')
];

var name = event.target.name,
size = event.target.size,
data = event.target.result;

// Dodgy fork because Chrome 6 dev doesn't add media type to base64 string when a dropped file(s) type isn't known
// http://code.google.com/p/chromium/issues/detail?id=48368
var dataURL = data.split("base64");

if(dataURL[0].indexOf("application/octet-stream") == -1) {
dataURL[0] = "data:application/octet-stream;base64"

data = dataURL[0] + dataURL[1];
}

fontList.set(name, data)

// Get font file and prepend it to stylsheet using @font-face rule
fontFaceStyle = "@font-face{font-family: "+name+"; src:url("+data+");}";
styleSheet.insertRule(fontFaceStyle, 0);

domElements[2].appendChild(document.createTextNode(" ("+size+")"));
domElements[1].appendChild(document.createTextNode(name));
domElements[0].className = "active";
domElements[0].title = name;
domElements[0].style.fontFamily = name;
domElements[0].appendChild(domElements[1]);
domElements[0].appendChild(domElements[2]);

fontPreviewFragment.appendChild(domElements[0]);

dropListing.appendChild(fontPreviewFragment);
TCNDDF.updateActiveFont(domElements[0]);

var fallbackfont = document.getElementById("fallbackfont").value;
displayContainer.style.fontFamily = [name, fallbackfont].join(',');

};

/* Control changing of fonts in drop list  */
TCNDDF.handleFontChange = function (evt) {
// console.log(fontList)
var clickTarget = evt.target || window.event.srcElement;

if(clickTarget.nodeName.toLowerCase() === 'span') {
clickTarget = clickTarget.parentNode;
TCNDDF.updateActiveFont(clickTarget);
} else {
TCNDDF.updateActiveFont(clickTarget);
}
};

TCNDDF.updateActiveFont = function (target) {
	var getFontFamily = target.title,
	dropListItem = dropListing.getElementsByTagName("li");
	var fallbackfont = document.getElementById("fallbackfont").value;
	displayContainer.style.fontFamily = [getFontFamily, fallbackfont].join(',');

	for(var i=0, len = dropListItem.length; i<len; i++) {
		dropListItem[i].className = "";
	}
	target.className = "active";

	// window.currentFont = getFontFamily;

	// Custom Addition by Andras Larsen
	document.title = displayContainer.style.fontFamily;

	const myFont = new Font(getFontFamily, {skipStyleSheet: true});
	myFont.src = fontList.get(getFontFamily)

	myFont.onerror = evt => console.error(evt);
	myFont.onload = evt => doSomeFontThings(evt);

	function doSomeFontThings(evt) {
	var font = evt.detail.font;
	var otTables = font.opentype.tables;
	var fontname = otTables.name.get(1);

	const GSUB = otTables.GSUB;
	const namet = otTables.name;

	var table = GSUB.getLangSysTable("DFLT", "dflt");

	for (var i = 1; i < 20; i +=1) {
		var ipad = String(i).padStart(2, '0');
		// console.log(ipad);
		document.getElementById('ss' + ipad + 'label').textContent='ss' + ipad;
	}

	GSUB.getFeatures(table).forEach(feature => {
		if (feature.featureTag.startsWith(`ss`)) {
			const params = feature.getFeatureParams();
			var featag = feature.featureTag
			if (params) {
				if (namet.get(params.UINameID)) {
					var feaname = namet.get(params.UINameID);
					document.getElementById(featag + 'label').textContent=feaname;
					// console.log(feature.featureTag, namet.get(params.UINameID));
				} else {
					document.getElementById(featag + 'label').textContent=featag;
				};
			};
		}
	});
	// get variable font axes
	if (otTables.fvar) {
		var axes = otTables.fvar.axes;
		var cssArr = [];
		varaxes.innerHTML = '';
		var axesInfo = [];

		axes.forEach((axis, a) => {
		var axisName = axis.tag;
		var axisProperName = font.opentype.tables.name.get(axis.axisNameID)
		var min = axis.minValue;
		var max = axis.maxValue;
		var defaultValue = axis.defaultValue;

		//create range sliders according to min/max axes values
		var axisDiv = document.createElement('div');
		var labelDiv = document.createElement('div');
		var sliderDiv = document.createElement('div');
		var rangSliderLabel = document.createElement('label');
		var datalistSlider = document.createElement('div');
		var rangSlider = document.createElement('input');
		var outSlider = document.createElement('input');

		labelDiv.setAttribute('id', 'labeldiv');
		sliderDiv.setAttribute('id', 'sliderdiv');

		datalistSlider.setAttribute('id', 'sliderlabels');
		var datalistMin = document.createElement('span');
		datalistMin.textContent = min;
		var datalistMax = document.createElement('span');
		datalistMax.textContent = max;

		rangSlider.setAttribute('type', 'range');
		rangSlider.setAttribute('id', axisName + '-slider');
		rangSlider.setAttribute('min', min);
		rangSlider.setAttribute('max', max);
		rangSlider.setAttribute('value', defaultValue);
		rangSlider.setAttribute('oninput', 'this.nextElementSibling.value = this.value');
		rangSlider.setAttribute('step', 1);
		rangSlider.setAttribute('list', 'minmaxlist');

		rangSliderLabel.textContent = axisProperName + " (" + axisName + ")" + ' - ';
		var axisVals = document.createElement('span')
		axisVals.setAttribute('style', 'font-weight: normal; color: var(--accent-300);');
		axisVals.textContent = 'min: ' + min + ' | max: ' + max + ' | dflt: ' + defaultValue

		outSlider.setAttribute('type', 'text');
		outSlider.setAttribute('id', axisName + '-txtbox');
		outSlider.setAttribute('oninput', 'this.previousElementSibling.value = this.value');
		outSlider.setAttribute('value', defaultValue);

		varaxes.appendChild(axisDiv);
		axisDiv.appendChild(labelDiv);
		labelDiv.appendChild(rangSliderLabel);
		rangSliderLabel.appendChild(axisVals);
		axisDiv.appendChild(sliderDiv);
		sliderDiv.appendChild(rangSlider);
		sliderDiv.appendChild(outSlider);
		outSlider.textContent = defaultValue;
		axisDiv.appendChild(datalistSlider);
		datalistSlider.appendChild(datalistMin);
		datalistSlider.appendChild(datalistMax);

		// set default style
		cssArr.push(`"${axisName}" ${defaultValue}`);
		axesInfo.push(`name:"${axisName}"; min:${min}; max:${max}; default:${defaultValue};`);

		// update values by range sliders
		rangSlider.addEventListener('input', function(e) {
			cssArr[a] = `"${axisName}" ${e.currentTarget.value}`;
			displayContainer.style.fontVariationSettings = cssArr.join(', ');
		})
		outSlider.addEventListener('input', function(e) {
			cssArr[a] = `"${axisName}" ${e.currentTarget.value}`;
			displayContainer.style.fontVariationSettings = cssArr.join(', ');
		})
		})

		var instances = otTables.fvar.instances;
		var instanceInfo = new Map();
		instances.forEach((instance, a)=> {
		var instanceName = font.opentype.tables.name.get(instance.subfamilyNameID);
		var instanceCoords = instance.coordinates;
		var instanceAxesCoords = new Map();
		for (var i=0, len=instanceCoords.length; i<len; i++) {
			// console.log(i, instanceCoords.at(i));
			// console.log(instanceName, axes.at(i).tag, instanceCoords.at(i));
			instanceAxesCoords.set(axes.at(i).tag, instanceCoords.at(i));
		};
		instanceInfo.set(instanceName, instanceAxesCoords);
		// console.log(instanceName, instanceCoords);
		});
		// console.log(instanceInfo);

		var instanceDiv = document.createElement('div');
		instanceDiv.setAttribute('id', 'instancediv');

		var instanceTitle= document.createElement('div');
		instanceTitle.setAttribute('id', 'vartitle');
		instanceTitle.textContent = 'Instance Selection';

		var instanceSelector = document.createElement('select');
		instanceSelector.setAttribute('id', 'instances');
		varaxes.appendChild(instanceDiv);
		instanceDiv.appendChild(instanceTitle);
		instanceDiv.appendChild(instanceSelector);

		for (let [k,v] of instanceInfo.entries()) {
			var instanceOpt = document.createElement('option')
			instanceOpt.setAttribute('value', k);
			instanceOpt.textContent = k;
			for (let [l, w] of v.entries()) {
				instanceOpt.setAttribute('data-' + l, w);
			};
			instanceSelector.appendChild(instanceOpt);
			// console.log(k, v);
		};

		var selectedInstance = document.getElementById('instances');

		function onChange() {
			var instval = selectedInstance.value;
			var selopt = selectedInstance.options[selectedInstance.selectedIndex];
			axes.forEach((axis, a) => {
				var axisTag = axis.tag;
				// console.log(selopt.getAttribute("data-" + axisTag));
				document.getElementById(axisTag + '-slider').value = selopt.getAttribute("data-" + axisTag);
				document.getElementById(axisTag + '-txtbox').value = selopt.getAttribute("data-" + axisTag);
				cssArr[a] = `"${axisTag}" ${selopt.getAttribute("data-" + axisTag)}`;
				displayContainer.style.fontVariationSettings = cssArr.join(', ');
			});
			// console.log(instval);
		};
		selectedInstance.onchange = onChange;
		onChange;
		// console.log(axesInfo.join('\n'))

		//var fontVariationOptions = `font-variation-settings: ${cssArr.join(', ')}`;
		displayContainer.style.fontVariationSettings = cssArr.join(', ');
		//console.log(fontVariationOptions)
		} else {
			varaxes.innerHTML = '';
			var noVar = document.createElement('h3');
			varaxes.appendChild(noVar);
			noVar.textContent = "Not a variable font!";

		}
	}
};

/* localStorage methods */
TCNDDF.readContentEdits = function (storageKey) {
var editedContent = persistantStorage.getItem(storageKey);

if(!!editedContent && editedContent !== "undefined") {
displayContainer.innerHTML = editedContent;
}
};
TCNDDF.writeContentEdits = function (storageKey) {
var content = displayContainer.innerHTML;

persistantStorage.setItem(storageKey, content);
};

/* Offline cache methods */
TCNDDF.updateCache = function () {
webappCache.swapCache();
console.log("Cache has been updated due to a change found in the manifest");
};
TCNDDF.errorCache = function () {
console.log("You're either offline or something has gone horribly wrong.");
};

/* Util functions */
TCNDDF.preventActions = function (evt) {
if(evt.stopPropagation && evt.preventDefault) {
evt.stopPropagation();
evt.preventDefault();
} else {
evt.cancelBubble = true;
evt.returnValue = false;
}
};

window.addEventListener("load", TCNDDF.setup, false);
})();
