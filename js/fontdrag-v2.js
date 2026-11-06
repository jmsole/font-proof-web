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

/* Sort keys, as in Font Snoop; criteria are applied in order, first is primary */
const SORT_KEYS = {family: "Family", weight: "Weight", width: "Width", slant: "Slant", opsz: "Optical Size"};
var sortCriteria = [];

TCNDDF.setup = function () {
dropListing = document.getElementById("fonts");
dropContainer = document.getElementsByTagName("section")[0];
displayContainer = document.getElementById("custom");
upload = document.getElementById("upload");
styleSheet = document.styleSheets[0];

dropListing.addEventListener("click", TCNDDF.handleFontChange, false);

/* LocalStorage events */
if(persistantStorage) {
displayContainer.addEventListener("keyup", function(){contentStorageTimer = setTimeout(function(){ TCNDDF.writeContentEdits('mainContent'); }, 1000);}, false);
displayContainer.addEventListener("keydown", function(){clearTimeout(contentStorageTimer);}, false);

// Restore changed data
TCNDDF.readContentEdits("mainContent");
}

/* DnD event listeners (header and the sticky font list both accept drops) */
[dropContainer, dropListing].forEach(function (target) {
target.addEventListener("dragenter", function(event){TCNDDF.preventActions(event);}, false);
target.addEventListener("dragover", function(event){TCNDDF.preventActions(event);}, false);
target.addEventListener("drop", TCNDDF.handleDrop, false);
});

/* Number keys 1-9, 0 and left/right arrows switch fonts when not typing */
document.addEventListener("keydown", TCNDDF.handleFontKey, false);

/* Drag font names to reorder them; drag sort chips to change their priority */
TCNDDF.makeReorderable(dropListing, TCNDDF.saveListState);
TCNDDF.makeReorderable(document.getElementById("sortchips"), TCNDDF.readSortChips);
TCNDDF.setupSortBar();

/* Keep the sticky nav bar just below the font list as it wraps onto more lines */
var controlContainer = document.getElementById("controlcontainer");
new ResizeObserver(function () {
controlContainer.style.top = dropListing.offsetHeight + "px";
}).observe(dropListing);

document.getElementById("clearfonts").addEventListener("click", TCNDDF.clearFonts, false);
TCNDDF.restoreFonts();

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
TCNDDF.addFont(event.target.name, event.target.size, event.target.result, true);
};

/* Add a font to the list and the page. Fonts loaded by the user are saved
   (save) so they survive switching between script pages; restored fonts
   are added without activating each one in turn (restoring). */
TCNDDF.addFont = function (name, size, data, save, restoring) {
domElements = [
document.createElement('li'),
document.createElement('span'),
document.createElement('span')
];

// Deduplicate: append -2, -3 etc. if this name is already loaded
var baseName = name;
var counter = 2;
while (fontList.has(name)) {
	name = baseName + '-' + counter;
	counter++;
}

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
domElements[0].draggable = true;
domElements[0].style.fontFamily = name;
domElements[0].appendChild(domElements[1]);
domElements[0].appendChild(domElements[2]);

fontPreviewFragment.appendChild(domElements[0]);

dropListing.appendChild(fontPreviewFragment);
document.body.classList.add("hasfonts");
if (!restoring) {
TCNDDF.updateActiveFont(domElements[0]);

var fallbackfont = document.getElementById("fallbackfont").value;
displayContainer.style.fontFamily = fallbackfont ? [name, fallbackfont].join(',') : name;
}

TCNDDF.readSortInfo(domElements[0], name);
if (save) TCNDDF.storeFont(name, size, data);
};

/* Read the values the sort bar uses and re-sort once they're known */
TCNDDF.readSortInfo = function (item, name) {
const font = new Font(name, {skipStyleSheet: true});
font.onerror = evt => console.error(evt);
font.onload = function (evt) {
var tables = evt.detail.font.opentype.tables,
os2 = tables["OS/2"],
opsz = tables.fvar && tables.fvar.axes.find(axis => axis.tag === "opsz");
item.sortInfo = {
family: tables.name.get(16) || tables.name.get(1) || name,
weight: os2 ? os2.usWeightClass : null,
width: os2 ? os2.usWidthClass : null,
slant: tables.post ? tables.post.italicAngle : null, // negative for right-leaning italics
opsz: opsz ? opsz.defaultValue : null // static fonts have none
};
TCNDDF.applySort();
};
font.src = fontList.get(name);
};

/* Multi-level sort of the font list. Fonts missing a value go after those
   that have it; fully equal fonts keep their relative order. */
TCNDDF.applySort = function () {
if (!sortCriteria.length) return;
Array.from(dropListing.getElementsByTagName("li"), (item, index) => ({item, index}))
.sort(function (a, b) {
for (const criterion of sortCriteria) {
var x = a.item.sortInfo ? a.item.sortInfo[criterion.key] : null,
y = b.item.sortInfo ? b.item.sortInfo[criterion.key] : null;
if (x == null || y == null) {
if (x == null && y == null) continue;
return x == null ? 1 : -1;
}
var order = criterion.key === "family" ? x.localeCompare(y, undefined, {numeric: true}) : x - y;
if (order) return criterion.ascending ? order : -order;
}
return a.index - b.index;
})
.forEach(entry => dropListing.appendChild(entry.item));
TCNDDF.saveListState();
};

/* Sort bar: chips toggle ascending/descending and can be removed */
TCNDDF.setupSortBar = function () {
var chips = document.getElementById("sortchips"),
add = document.getElementById("sortadd");

add.addEventListener("change", function () {
sortCriteria.push({key: add.value, ascending: true});
TCNDDF.sessionSet("fp-sort", JSON.stringify(sortCriteria));
TCNDDF.renderSortBar();
TCNDDF.applySort();
});

chips.addEventListener("click", function (evt) {
var chip = evt.target.parentNode,
criterion = chip.criterion;
if (!criterion) return;
if (evt.target.className === "sortdir") criterion.ascending = !criterion.ascending;
if (evt.target.className === "sortremove") sortCriteria.splice(sortCriteria.indexOf(criterion), 1);
TCNDDF.sessionSet("fp-sort", JSON.stringify(sortCriteria));
TCNDDF.renderSortBar();
TCNDDF.applySort();
});

TCNDDF.renderSortBar();
};

TCNDDF.renderSortBar = function () {
var chips = document.getElementById("sortchips"),
add = document.getElementById("sortadd"),
used = sortCriteria.map(criterion => criterion.key);

chips.innerHTML = "";
sortCriteria.forEach(function (criterion) {
var chip = document.createElement("span"),
dir = document.createElement("button"),
remove = document.createElement("button");
chip.className = "sortchip";
chip.draggable = true;
chip.criterion = criterion;
dir.className = "sortdir";
dir.textContent = criterion.ascending ? "▲" : "▼";
dir.title = criterion.ascending ? "Ascending" : "Descending";
remove.className = "sortremove";
remove.textContent = "×";
remove.title = "Remove";
chip.append(SORT_KEYS[criterion.key], dir, remove);
chips.appendChild(chip);
});

add.innerHTML = "";
add.add(new Option("+", ""));
Object.keys(SORT_KEYS).forEach(function (key) {
if (used.indexOf(key) === -1) add.add(new Option(SORT_KEYS[key], key));
});
add.parentNode.style.display = add.options.length > 1 ? "" : "none";
};

/* Sort chip order after a drag sets criterion priority */
TCNDDF.readSortChips = function () {
sortCriteria = Array.from(document.getElementById("sortchips").children, chip => chip.criterion);
TCNDDF.sessionSet("fp-sort", JSON.stringify(sortCriteria));
TCNDDF.applySort();
};

/* Drag a container's children to reorder them; onReorder runs after the drop */
TCNDDF.makeReorderable = function (container, onReorder) {
var dragged = null;

container.addEventListener("dragstart", function (evt) {
if (evt.target.parentNode !== container) return;
dragged = evt.target;
dragged.classList.add("dragging");
evt.dataTransfer.effectAllowed = "move";
evt.dataTransfer.setData("text/plain", "");
}, false);

container.addEventListener("dragover", function (evt) {
if (!dragged) return; // a file drag, handled by the drop listeners
evt.preventDefault();
var over = evt.target;
while (over && over.parentNode !== container) over = over.parentNode;
if (!over || over === dragged) return;
var rect = over.getBoundingClientRect();
container.insertBefore(dragged, evt.clientX > rect.left + rect.width / 2 ? over.nextSibling : over);
}, false);

container.addEventListener("dragend", function () {
if (!dragged) return;
dragged.classList.remove("dragging");
dragged = null;
if (onReorder) onReorder();
}, false);
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

TCNDDF.handleFontKey = function (evt) {
var digit = /^Digit(\d)$/.exec(evt.code),
arrow = evt.key === "ArrowLeft" ? -1 : evt.key === "ArrowRight" ? 1 : 0,
target = evt.target,
selection = window.getSelection(),
items = dropListing.getElementsByTagName("li"),
item;

if ((!digit && !arrow) || evt.ctrlKey || evt.metaKey || evt.altKey) return;
if (arrow && evt.shiftKey) return;
if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.nodeName)) return;
if (selection && !selection.isCollapsed) return;

if (digit) {
item = items[digit[1] === "0" ? 9 : parseInt(digit[1], 10) - 1];
} else if (items.length) {
// Step from the active font, wrapping around at either end
var current = Array.prototype.indexOf.call(items, dropListing.querySelector("li.active"));
item = items[(current + arrow + items.length) % items.length];
}

if (item) {
evt.preventDefault();
TCNDDF.updateActiveFont(item);
}
};

TCNDDF.updateActiveFont = function (target) {
	var getFontFamily = target.title,
	dropListItem = dropListing.getElementsByTagName("li");
	var fallbackfont = document.getElementById("fallbackfont").value;
	displayContainer.style.fontFamily = fallbackfont ? [getFontFamily, fallbackfont].join(',') : getFontFamily;

	for(var i=0, len = dropListItem.length; i<len; i++) {
		dropListItem[i].className = "";
	}
	target.className = "active";
	TCNDDF.saveListState();

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
	const namet = otTables.name;

	// Always reset ss labels when a new font is loaded
	for (var i = 1; i < 20; i +=1) {
		var ipad = String(i).padStart(2, '0');
		document.getElementById('ss' + ipad + 'label').textContent='ss' + ipad;
	}

	const GSUB = otTables.GSUB;
	if (GSUB) {
		// Try scripts in priority order based on the page's declared preference,
		// falling back to DFLT if nothing more specific is found.
		var scriptPriority = (typeof PAGE_SCRIPT_PRIORITY !== 'undefined') ? PAGE_SCRIPT_PRIORITY : ['latn', 'DFLT'];
		var table = null;
		for (var s = 0; s < scriptPriority.length; s++) {
			table = GSUB.getLangSysTable(scriptPriority[s], "dflt");
			if (table) break;
		}
		if (table) {
			GSUB.getFeatures(table).forEach(feature => {
				if (feature.featureTag.startsWith(`ss`)) {
					const params = feature.getFeatureParams();
					var featag = feature.featureTag;
					if (params) {
						if (namet.get(params.UINameID)) {
							var feaname = namet.get(params.UINameID);
							document.getElementById(featag + 'label').textContent=feaname;
						} else {
							document.getElementById(featag + 'label').textContent=featag;
						}
					}
				}
			});
		}
	}

	// get variable font axes
	var varaxes = document.getElementById('varaxes');
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

		labelDiv.setAttribute('class', 'labeldiv');
		sliderDiv.setAttribute('class', 'sliderdiv');

		datalistSlider.setAttribute('class', 'sliderlabels');
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
		instanceTitle.setAttribute('class', 'vartitle');
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
		onChange();
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

/* Loaded fonts are kept in IndexedDB (localStorage is too small for font
   files) for as long as this browser tab is open, so switching between the
   script pages or reloading keeps them. A new tab starts empty. */
var FONT_DB = "fontproof",
FONT_STORE = "fonts",
FONT_MAX_AGE = 2 * 24 * 60 * 60 * 1000, // drop other tabs' fonts after two days
fontDB = null;

TCNDDF.sessionGet = function (key) {
try { return sessionStorage.getItem(key); } catch (e) { return null; }
};
TCNDDF.sessionSet = function (key, value) {
try { sessionStorage.setItem(key, value); } catch (e) {}
};

/* One id per browser tab; sessionStorage survives page changes within it */
TCNDDF.sessionId = function () {
var id = TCNDDF.sessionGet("fp-session");
if (!id) {
id = Date.now() + "-" + Math.random().toString(36).slice(2);
TCNDDF.sessionSet("fp-session", id);
}
return id;
};

TCNDDF.fontStore = function (mode) {
if (!fontDB) {
fontDB = new Promise(function (resolve, reject) {
var request = indexedDB.open(FONT_DB, 1);
request.onupgradeneeded = function () {
request.result.createObjectStore(FONT_STORE, {keyPath: ["session", "name"]});
};
request.onsuccess = function () { resolve(request.result); };
request.onerror = function () { reject(request.error); };
});
}
return fontDB.then(db => db.transaction(FONT_STORE, mode).objectStore(FONT_STORE));
};

TCNDDF.storeFont = function (name, size, data) {
TCNDDF.fontStore("readwrite")
.then(store => store.put({session: TCNDDF.sessionId(), name: name, size: size, data: data, saved: Date.now()}))
.catch(err => console.warn("Could not keep font for other pages", err));
};

/* Remember the list order and the active font */
TCNDDF.saveListState = function () {
var items = dropListing.getElementsByTagName("li"),
active = dropListing.querySelector("li.active");
TCNDDF.sessionSet("fp-order", JSON.stringify(Array.from(items, item => item.title)));
TCNDDF.sessionSet("fp-active", active ? active.title : "");
};

/* Read this tab's saved fonts, and drop other tabs' fonts once they're old */
TCNDDF.readSessionFonts = function () {
var session = TCNDDF.sessionId();
return TCNDDF.fontStore("readwrite").then(store => new Promise(function (resolve, reject) {
var fonts = [],
cursorRequest = store.openCursor();
cursorRequest.onerror = () => reject(cursorRequest.error);
cursorRequest.onsuccess = function () {
var cursor = cursorRequest.result;
if (!cursor) return resolve(fonts);
var font = cursor.value;
if (font.session === session) fonts.push(font);
else if (Date.now() - font.saved > FONT_MAX_AGE) cursor.delete();
cursor.continue();
};
}));
};

/* While saved fonts load, show their names in the font bar right away,
   marked as loading, so switching pages doesn't flash an empty bar */
TCNDDF.showPlaceholders = function () {
var bar = document.getElementById("fonts");
if (!bar || !document.documentElement.classList.contains("restoring")) return;
JSON.parse(TCNDDF.sessionGet("fp-order") || "[]").forEach(function (name) {
var item = document.createElement("li"),
label = document.createElement("span");
item.className = "placeholder";
label.textContent = name;
item.appendChild(label);
bar.appendChild(item);
});
};

TCNDDF.endRestoring = function () {
Array.from(dropListing.querySelectorAll("li.placeholder"), item => item.remove());
document.documentElement.classList.remove("restoring");
};

TCNDDF.restoreFonts = function () {
if (!window.indexedDB) return TCNDDF.endRestoring();
var order = JSON.parse(TCNDDF.sessionGet("fp-order") || "[]"),
activeName = TCNDDF.sessionGet("fp-active"),
sort = JSON.parse(TCNDDF.sessionGet("fp-sort") || "[]");

(TCNDDF.savedFonts || TCNDDF.readSessionFonts()).then(function (fonts) {
TCNDDF.endRestoring();
if (!fonts.length) return;

var position = name => { var i = order.indexOf(name); return i === -1 ? order.length : i; };
fonts.sort((a, b) => position(a.name) - position(b.name));
sortCriteria = sort.filter(criterion => SORT_KEYS[criterion.key]);
TCNDDF.renderSortBar();
fonts.forEach(font => TCNDDF.addFont(font.name, font.size, font.data, false, true));

var items = Array.from(dropListing.getElementsByTagName("li")),
active = items.find(item => item.title === activeName) || items[items.length - 1];
TCNDDF.updateActiveFont(active);
}).catch(function (err) {
TCNDDF.endRestoring();
console.warn("Could not restore fonts", err);
});
};

/* Forget this tab's fonts and start over */
TCNDDF.clearFonts = function () {
var session = TCNDDF.sessionId();
["fp-order", "fp-active", "fp-sort"].forEach(key => { try { sessionStorage.removeItem(key); } catch (e) {} });
TCNDDF.fontStore("readwrite").then(function (store) {
var cursorRequest = store.openCursor();
cursorRequest.onsuccess = function () {
var cursor = cursorRequest.result;
if (cursor) {
if (cursor.value.session === session) cursor.delete();
cursor.continue();
}
};
cursorRequest.transaction.oncomplete = () => location.reload();
}).catch(() => location.reload());
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

/* If this tab has fonts from another page, start reading them now and show
   the loading state from the first paint */
if (window.indexedDB && JSON.parse(TCNDDF.sessionGet("fp-order") || "[]").length) {
document.documentElement.classList.add("restoring");
TCNDDF.savedFonts = TCNDDF.readSessionFonts();
TCNDDF.savedFonts.catch(() => {}); // reported when restoring
document.addEventListener("DOMContentLoaded", TCNDDF.showPlaceholders, false);
}

window.addEventListener("load", TCNDDF.setup, false);
})();
