<!-- Header -->
<div id="fonts"></div>
<section id="top">
	<header><h1>Drag fonts here <label for="upload" id="fileup">or <u>click here</u> to load fonts</label><input type="file" id="upload" multiple></h1></header>
</section>
<!-- OT Features Menu -->
<div id="controlcontainer">
<div id="toggleotfeatures">
	<a href="javascript://" id="showhide">OpenType Features</a> |
	<a href="javascript://" id="showhide-var">Variable</a>
	<!-- Editions nav menu: Latins go first, then all scripts follow alphabetically, then tools, then helper. -->
	<span id="editions"> | <a href="index.php">Latin 1</a> | <a href="index-arabic.php">Arabic</a> | <a href="index-latin-02.php">Latin 2</a> | <a href="index-latin-african.php">African Latin</a></span>
</div>
<div id="otfeatures" style="display: none;">
	<table width="100%">
		<tr>
			<td valign="top" width="25%">
				<label id="featitles">Always-on</label>
				<br/>
				<input type="checkbox" id="kern" onchange="refreshFeatures()" checked>OpenType Kerning</input><br/>
				<input type="checkbox" id="liga" checked onchange="refreshFeatures()">Standard Ligatures</input><br/>
				<input type="checkbox" id="ccmp" checked onchange="refreshFeatures()">Glyph Composition/Decomposition</input><br/>
				<input type="checkbox" id="calt" checked onchange="refreshFeatures()">Contextual Alternates</input><br/>
				<input type="checkbox" id="rlig" onchange="refreshFeatures()">Required Ligatures</input><br/>
				<input type="checkbox" id="rclt" onchange="refreshFeatures()">Required Contextual Alternates</input><br/>
				<input type="checkbox" id="rvrn" onchange="refreshFeatures()">Required Variation Alternates</input><br/>
				<input type="checkbox" id="mark" onchange="refreshFeatures()">Mark Positioning</input><br/>
				<input type="checkbox" id="mkmk" onchange="refreshFeatures()">Mark-to-mark Positioning</input>
			</td>
			<td valign="top" width="25%">
				<label id="featitles">Casing features</label>
				<br/>
				<input type="radio" name="smcp" checked onchange="refreshFeatures()">SmallCaps Off</input><br/>
				<input type="radio" id="fake-smcp" name="smcp" onchange="refreshFeatures()">Fake SmallCaps</input><br/>
				<input type="radio" id="smcp" name="smcp" onchange="refreshFeatures()">Real SmallCaps</input><br/>
				<input type="checkbox" id="c2sc" onchange="refreshFeatures()">Capitals to Small Caps</input><br/>
				<input type="checkbox" id="case" onchange="refreshFeatures()">Case Sensitive Forms</input><br/>
				<br/>
				<label id="featitles">Other manual features</label>
				<br/>
				<input type="checkbox" id="dlig" onchange="refreshFeatures()">Discretionary Ligatures</input><br/>
				<input type="checkbox" id="swsh" onchange="refreshFeatures()">Swashes</input><br/>
				<input type="checkbox" id="salt" onchange="refreshFeatures()">Stilistic Alternates</input><br/>
			</td>
			<td width="12.5%" valign="top">
			<label id="featitles">Stylistic Sets</label>
			<br/>
				<input type="checkbox" id="ss01" onchange="refreshFeatures()"></input><label id="ss01label" for="ss01">ss01</label> <br/> 
				<input type="checkbox" id="ss02" onchange="refreshFeatures()"></input><label id="ss02label" for="ss02">ss02</label> <br/> 
				<input type="checkbox" id="ss03" onchange="refreshFeatures()"></input><label id="ss03label" for="ss03">ss03</label> <br/> 
				<input type="checkbox" id="ss04" onchange="refreshFeatures()"></input><label id="ss04label" for="ss04">ss04</label> <br/> 
				<input type="checkbox" id="ss05" onchange="refreshFeatures()"></input><label id="ss05label" for="ss05">ss05</label>
			</td>
			<td width="12.5%" valign="top">
			<br/>
				<input type="checkbox" id="ss06" onchange="refreshFeatures()"></input><label id="ss06label" for="ss06">ss06</label> <br/> 
				<input type="checkbox" id="ss07" onchange="refreshFeatures()"></input><label id="ss07label" for="ss07">ss07</label> <br/> 
				<input type="checkbox" id="ss08" onchange="refreshFeatures()"></input><label id="ss08label" for="ss08">ss08</label> <br/> 
				<input type="checkbox" id="ss09" onchange="refreshFeatures()"></input><label id="ss09label" for="ss09">ss09</label> <br/> 
				<input type="checkbox" id="ss10" onchange="refreshFeatures()"></input><label id="ss10label" for="ss10">ss10</label>
			</td>
			<td width="12.5%" valign="top">
			<br/>
				<input type="checkbox" id="ss11" onchange="refreshFeatures()"></input><label id="ss11label" for="ss11">ss11</label> <br/>
				<input type="checkbox" id="ss12" onchange="refreshFeatures()"></input><label id="ss12label" for="ss12">ss12</label> <br/>
				<input type="checkbox" id="ss13" onchange="refreshFeatures()"></input><label id="ss13label" for="ss13">ss13</label> <br/>
				<input type="checkbox" id="ss14" onchange="refreshFeatures()"></input><label id="ss14label" for="ss14">ss14</label> <br/>
				<input type="checkbox" id="ss15" onchange="refreshFeatures()"></input><label id="ss15label" for="ss15">ss15</label>
			</td>
			<td width="12.5%" valign="top">
			<br/>
				<input type="checkbox" id="ss16" onchange="refreshFeatures()"></input><label id="ss16label" for="ss16">ss16</label> <br/>
				<input type="checkbox" id="ss17" onchange="refreshFeatures()"></input><label id="ss17label" for="ss17">ss17</label> <br/>
				<input type="checkbox" id="ss18" onchange="refreshFeatures()"></input><label id="ss18label" for="ss18">ss18</label> <br/>
				<input type="checkbox" id="ss19" onchange="refreshFeatures()"></input><label id="ss19label" for="ss19">ss19</label> <br/>
				<input type="checkbox" id="ss20" onchange="refreshFeatures()"></input><label id="ss20label" for="ss20">ss20</label>
			</td>
		</tr>
		<tr>
			<br/>
			<td valign="top" width="25%">
				<label id="featitles">Numeral features</label>
				<br/>
				<input type="radio" name="numsty" checked onchange="refreshFeatures()">Default Figures Style</input><br/>
				<input type="radio" id="lnum" name="numsty" onchange="refreshFeatures()">Lining Figures</input><br/>
				<input type="radio" id="onum" name="numsty" onchange="refreshFeatures()">Oldstyle Figures</input><br/>
				<br/>
				<input type="radio" name="numspc" checked onchange="refreshFeatures()">Default Figures Width</input><br/>
				<input type="radio" id="pnum" name="numspc" onchange="refreshFeatures()">Proportional Figures</input><br/>
				<input type="radio" id="tnum" name="numspc" onchange="refreshFeatures()">Tabular Figures</input>
			</td>
			<td valign="top" width="25%">
				<br/>
				<input type="checkbox" id="ordn" onchange="refreshFeatures()">Ordinals</input><br/>
				<input type="checkbox" id="frac" name="frac" onchange="refreshFeatures()">Fractions</input><br/>
				<input type="checkbox" id="zero" onchange="refreshFeatures()">Slashed zero</input><br/>
				<input type="checkbox" id="sups" onchange="refreshFeatures()">Superiors</input><br/>
				<input type="checkbox" id="numr" onchange="refreshFeatures()">Numerator</input><br/>
				<input type="checkbox" id="dnom" onchange="refreshFeatures()">Denominator</input><br/>
				<input type="checkbox" id="sinf" onchange="refreshFeatures()">Inferiors</input>			
			</td>
			<td valign="top" width="25%" colspan="2">
				<label id="featitles">CSS transforms</label>
				<br />
				<label>
					<input type="checkbox" id="rtl" onchange="refreshFeatures()"/>
					<span style="direction: rtl">Right-to-left</span>
				</label>
				<br/>
				<label>
					<input type="checkbox" id="cssallcaps" onchange="refreshFeatures()"/>
					<span style="text-transform: uppercase">Transform to all caps</span>
				</label><br/>
				<br/>
				<label id="featitles" for="unicodebmp">Fallback Font</label><br/>
				<input type="radio" checked id="unicodebmp" name="fallback" onchange="refreshFeatures()">Unicode BMP Fallback Font</input> <br/>
				<input type="radio" id="adobeblank" name="fallback" onchange="refreshFeatures()">Adobe Blank</input> &nbsp;
				<input id="fallbackfont" type="text" style="display:none" />
			</td>
			<td valign="top" width="25%" colspan="2">
				<br/>
				<label>
					<input type="checkbox" id="underline" onchange="refreshFeatures()"/>
					<span style="text-decoration: underline">Underline</span>
				</label>
				<br/>
				<label>
					<input type="checkbox" id="strikethrough" onchange="refreshFeatures()"/>
					<span style="text-decoration: strikethrough">Strikethrough</span>
				</label>
			</td>
		</tr>
	</table>
</div>
<div id="otvariations" style="display: none;">
	<div id="vartitle">Variable axes</div>
	<div id="varaxes"></div>
</div>
</div>
<!-- End OT Features Menu -->