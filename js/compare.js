/* Compare tab: the same text in each checked font, as columns or rows */
(function () {
var fontsBar, list, output, textBox, sizeBox,
unchecked = new Set(); // fonts left out; new fonts are included by default

function loadedFonts() {
return Array.from(fontsBar.getElementsByTagName("li"), item => item.title);
}

function renderList() {
list.innerHTML = "";
loadedFonts().forEach(function (name) {
var label = document.createElement("label"),
box = document.createElement("input");
box.type = "checkbox";
box.value = name;
box.checked = !unchecked.has(name);
label.append(box, " " + name);
list.appendChild(label);
});
if (!list.firstChild) list.textContent = "Load two or more fonts to compare them.";
}

function render() {
var fonts = loadedFonts().filter(name => !unchecked.has(name)),
lines = textBox.value.split("\n"),
layout = document.querySelector("input[name=comparelayout]:checked").value,
fallback = document.getElementById("fallbackfont").value;

function element(className, text) {
var el = document.createElement("div");
el.className = className;
if (text !== undefined) el.textContent = text;
return el;
}
function sample(name, line) {
var el = element("comparesample", line || " ");
el.dir = "auto"; // right-to-left for Arabic text, left-to-right for Latin
el.style.fontFamily = fallback ? name + "," + fallback : name;
return el;
}

output.innerHTML = "";
output.className = layout;
output.style.fontSize = sizeBox.value + "px";

if (layout === "columns") {
fonts.forEach(function (name) {
var column = element("comparecolumn");
column.appendChild(element("comparelabel", name));
lines.forEach(line => column.appendChild(sample(name, line)));
output.appendChild(column);
});
} else {
lines.forEach(function (line) {
var group = element("comparegroup");
fonts.forEach(function (name) {
var row = element("comparerow");
row.append(element("comparelabel", name), sample(name, line));
group.appendChild(row);
});
output.appendChild(group);
});
}
}

document.addEventListener("DOMContentLoaded", function () {
fontsBar = document.getElementById("fonts");
list = document.getElementById("comparefonts");
output = document.getElementById("compareoutput");
textBox = document.getElementById("comparetext");
sizeBox = document.getElementById("comparesize");

// Fonts added, removed, sorted or dragged in the font bar
new MutationObserver(function () { renderList(); render(); }).observe(fontsBar, {childList: true});

list.addEventListener("change", function (evt) {
if (evt.target.checked) unchecked.delete(evt.target.value);
else unchecked.add(evt.target.value);
render();
});
textBox.addEventListener("input", render);
sizeBox.addEventListener("input", render);
document.querySelectorAll("input[name=comparelayout], input[name=fallback]").forEach(function (input) {
input.addEventListener("change", render);
});

renderList();
render();
});
})();
