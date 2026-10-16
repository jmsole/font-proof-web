<?php
// Compare tab: shows the same text in two or more loaded fonts.
// Entry points can set $compareText before including this file.
if (!isset($compareText)) {
	$compareText = "Hamburgefonstiv HAMBURGEFONSTIV 0123456789\nJackdaws love my big sphinx of quartz.";
}
?>
<div id="comparecontrols">
	<div id="comparefonts"></div>
	<div>
		<label><input type="radio" name="comparelayout" value="columns" checked> Columns</label>
		<label><input type="radio" name="comparelayout" value="rows"> Rows</label>
		&nbsp; <label>Size <input type="number" id="comparesize" value="32" min="6" max="300">px</label>
	</div>
	<textarea id="comparetext" rows="3" dir="auto"><?php echo htmlspecialchars($compareText); ?></textarea>
</div>
<div id="compareoutput"></div>
