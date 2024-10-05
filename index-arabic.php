<?php header("Content-type: text/html; charset=utf-8"); // UTF 8 ?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Font Testing Page - Arabic Version</title>
<link type="text/css" href="css/styles-v11.css?rand=<?php echo rand(5,500)?>" rel="stylesheet" charset="utf-8" />
<link type="text/css" href="css/print-v9.css" rel="stylesheet" media="print" charset="utf-8" />
<script src="js/jquery-1.7.2.min.js" type="text/javascript" charset="utf-8"></script>
<script>localStorage.clear();</script>
<script src="js/fontdrag.js" type="text/javascript" charset="utf-8"></script>
<script src="js/otfeatures-v9.1.js" type="text/javascript" charset="utf-8"></script>
<script src="js/contentEditable.js" type="text/javascript" charset="utf-8"></script>
<script src="includes/arabic/constants-arabic.js" type="text/javascript" charset="utf-8"></script>
<script src="js/init.js" type="text/javascript" charset="utf-8"></script>

<script>
$(document).ready(function(){

	// Grab the text from the JS constant file, and show it
	prepareAndShowFontLayout();

});
</script>

</head>

<body spellcheck="false">

<?php include("includes/top.php"); ?>

<section id="custom">

	<div class="tabs">
		<!-- Navigation (Ideally, this should be outside the "custom" section, so the navigation's font does not change.) -->
		<ul class="tabNavigation">
		<li><a href="#headlines">Headlines</a></li>
		<li><a href="#arabictext">Arabic Text</a></li>
		<li><a href="#persiantext">Persian Text</a></li>
		<li><a href="#urdutext">Urdu Text</a></li>
		<li><a href="#vocalized">Vocalized Text</a></li>
		<li><a href="#charset">Character Set</a></li>
		<li><a href="#kern">Kern</a></li>
		</ul>

		<!-- Headlines (Content injected via constants.js) -->
		<div lang="ar" id="headlines">
		<div style="white-space: nowrap; overflow: hidden; direction: rtl;"></div>
		</div>

		<!-- Text (Content injected via Javascript) -->
		<div lang="ar" id="arabictext" style="width: 960px; direction: rtl;">
			<div class="textsettingCol1"></div>
			<div class="textsettingCol2"></div>
		</div>

		<div lang="fa" id="persiantext" style="width: 960px; direction: rtl;">
			<div class="textsettingCol1"></div>
			<div class="textsettingCol2"></div>
		</div>

		<div lang="ur" id="urdutext" style="width: 960px; direction: rtl;">
			<div class="textsettingCol1"></div>
			<div class="textsettingCol2"></div>
		</div>

		<!-- Vocalized Text (Content injected via constants.js) -->
		<div lang="ar" id="vocalized">
		<div style="width: 960px; direction: rtl;line-height:1.6"></div>
		</div>

		<!-- Character Set (Content injected via constants.js) -->
		<div id="charset">
		<?php include("includes/arabic/charset.php"); ?>
		</div>

		<!-- Kerning -->
		<div id="kern">
		<?php include("includes/arabic/kerning.php"); ?>
		</div>

	</div><!-- end tabs -->

</section>
		
<!-- Footer -->
<?php include("includes/footer.php"); ?>

</body>
</html>