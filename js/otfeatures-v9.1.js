// http://www.impallari.com/testing/
// Version 9.1
// Pablo Impallari
//
// CSS3 Syntax

function refreshFeatures() {

	// CSS3 Syntax
	var codeCSS3 = "";
	if (document.getElementById("kern")) codeCSS3 += !document.getElementById("kern").checked ? '"kern" off, ' : '"kern" on, ';
	if (document.getElementById("liga")) codeCSS3 += !document.getElementById("liga").checked ? '"liga" off, ' : '"liga" on, ';
	if (document.getElementById("ccmp")) codeCSS3 += !document.getElementById("ccmp").checked ? '"ccmp" off, ' : '"ccmp" on, ';
	if (document.getElementById("calt")) codeCSS3 += !document.getElementById("calt").checked ? '"calt" off, ' : '"calt" on, ';
	if (document.getElementById("rlig")) codeCSS3 += !document.getElementById("rlig").checked ? '"rlig" off, ' : '"rlig" on, ';
	if (document.getElementById("rclt")) codeCSS3 += !document.getElementById("rclt").checked ? '"rclt" off, ' : '"rclt" on, ';
	if (document.getElementById("rvrn")) codeCSS3 += !document.getElementById("rvrn").checked ? '"rvrn" off, ' : '"rvrn" on, ';
	if (document.getElementById("mark")) codeCSS3 += !document.getElementById("mark").checked ? '"mark" off, ' : '"mark" on, ';
	if (document.getElementById("mkmk")) codeCSS3 += !document.getElementById("mkmk").checked ? '"mkmk" off, ' : '"mkmk" on, ';

	if (document.getElementById("dlig")) codeCSS3 += !document.getElementById("dlig").checked ? '' : '"dlig", ';
	if (document.getElementById("hlig")) codeCSS3 += !document.getElementById("hlig").checked ? '' : '"hlig", ';

	if (document.getElementById("swsh")) codeCSS3 += !document.getElementById("swsh").checked ? '' : '"swsh", ';
	if (document.getElementById("salt")) codeCSS3 += !document.getElementById("salt").checked ? '' : '"salt", ';

	if (document.getElementById("ss01")) codeCSS3 += !document.getElementById("ss01").checked ? '' : '"ss01", ';
	if (document.getElementById("ss02")) codeCSS3 += !document.getElementById("ss02").checked ? '' : '"ss02", ';
	if (document.getElementById("ss03")) codeCSS3 += !document.getElementById("ss03").checked ? '' : '"ss03", ';
	if (document.getElementById("ss04")) codeCSS3 += !document.getElementById("ss04").checked ? '' : '"ss04", ';
	if (document.getElementById("ss05")) codeCSS3 += !document.getElementById("ss05").checked ? '' : '"ss05", ';
	if (document.getElementById("ss06")) codeCSS3 += !document.getElementById("ss06").checked ? '' : '"ss06", ';
	if (document.getElementById("ss07")) codeCSS3 += !document.getElementById("ss07").checked ? '' : '"ss07", ';
	if (document.getElementById("ss08")) codeCSS3 += !document.getElementById("ss08").checked ? '' : '"ss08", ';
	if (document.getElementById("ss09")) codeCSS3 += !document.getElementById("ss09").checked ? '' : '"ss09", ';
	if (document.getElementById("ss10")) codeCSS3 += !document.getElementById("ss10").checked ? '' : '"ss10", ';
	if (document.getElementById("ss11")) codeCSS3 += !document.getElementById("ss11").checked ? '' : '"ss11", ';
	if (document.getElementById("ss12")) codeCSS3 += !document.getElementById("ss12").checked ? '' : '"ss12", ';
	if (document.getElementById("ss13")) codeCSS3 += !document.getElementById("ss13").checked ? '' : '"ss13", ';
	if (document.getElementById("ss14")) codeCSS3 += !document.getElementById("ss14").checked ? '' : '"ss14", ';
	if (document.getElementById("ss15")) codeCSS3 += !document.getElementById("ss15").checked ? '' : '"ss15", ';
	if (document.getElementById("ss16")) codeCSS3 += !document.getElementById("ss16").checked ? '' : '"ss16", ';
	if (document.getElementById("ss17")) codeCSS3 += !document.getElementById("ss17").checked ? '' : '"ss17", ';
	if (document.getElementById("ss18")) codeCSS3 += !document.getElementById("ss18").checked ? '' : '"ss18", ';
	if (document.getElementById("ss19")) codeCSS3 += !document.getElementById("ss19").checked ? '' : '"ss19", ';
	if (document.getElementById("ss20")) codeCSS3 += !document.getElementById("ss20").checked ? '' : '"ss20", ';

	if (document.getElementById("smcp")) codeCSS3 += !document.getElementById("smcp").checked ? '' : '"smcp", ';
	if (document.getElementById("c2sc")) codeCSS3 += !document.getElementById("c2sc").checked ? '' : '"c2sc", ';
	if (document.getElementById("case")) codeCSS3 += !document.getElementById("case").checked ? '' : '"case", ';

	if (document.getElementById("ordn")) codeCSS3 += !document.getElementById("ordn").checked ? '' : '"ordn", ';

	if (document.getElementById("lnum")) codeCSS3 += !document.getElementById("lnum").checked ? '' : '"lnum", ';
	if (document.getElementById("onum")) codeCSS3 += !document.getElementById("onum").checked ? '' : '"onum", ';
	if (document.getElementById("tnum")) codeCSS3 += !document.getElementById("tnum").checked ? '' : '"tnum", ';
	if (document.getElementById("pnum")) codeCSS3 += !document.getElementById("pnum").checked ? '' : '"pnum", ';

	if (document.getElementById("numr")) codeCSS3 += !document.getElementById("numr").checked ? '' : '"numr", ';
	if (document.getElementById("dnom")) codeCSS3 += !document.getElementById("dnom").checked ? '' : '"dnom", ';
	if (document.getElementById("sups")) codeCSS3 += !document.getElementById("sups").checked ? '' : '"sups", ';
	if (document.getElementById("sinf")) codeCSS3 += !document.getElementById("sinf").checked ? '' : '"sinf", ';

	if (document.getElementById("frac")) codeCSS3 += !document.getElementById("frac").checked ? '' : '"frac", ';
	if (document.getElementById("zero")) codeCSS3 += !document.getElementById("zero").checked ? '' : '"zero", ';

	codeCSS3 = codeCSS3.substring(0, codeCSS3.length - 2);

	// Special Case for Fake Small Caps
	var fakeSC = !document.getElementById("fake-smcp").checked ? 'normal' : 'small-caps';
	
	// Special case for underline and striketrough
	
	var rtl = document.getElementById("rtl").checked;
	var cssallcaps = document.getElementById("cssallcaps").checked;
	var underline = document.getElementById("underline").checked;
	var strikethrough = document.getElementById("strikethrough").checked;
	var textDecoration = "";
	if (underline) {
		textDecoration += "underline";
	}
	if (strikethrough) {
		textDecoration += " line-through";
	}
	var direction = "";
	if (rtl) {
		direction += "rtl";
	}
	var textTransform = "";
	if (cssallcaps) {
		textTransform += "uppercase";
	}

	// Apply the Code
	$("#custom").css("text-decoration", textDecoration);
	$("#custom").css("direction", direction);
	$("#custom").css("text-transform", textTransform);
	$("#custom").css("text-decoration-thickness", "from-font");
	$('#custom').css("font-variant", fakeSC);
	$('#custom').css("font-feature-settings", codeCSS3);
	$('#custom').css("-moz-font-feature-settings", codeCSS3);
	$('#custom').css("-webkit-font-feature-settings", codeCSS3);
	
	var fallbackfont = document.getElementById("fallbackfont");
	fallbackfont.value = (document.getElementById("unicodebmp").checked ? 'Unicode BMP Fallback' : 'Adobe Blank');
	var fontFamily = $('#custom').css('font-family').split(',');
	if (fontFamily.length > 1) {
		fontFamily[1] = fallbackfont.value;
		$('#custom').css('font-family', fontFamily.join(','));
	}

};