<?php

/**
 * See http://de.wikipedia.org/wiki/Mandelbrot-Menge#Grafische_Darstellung:
 *
 *
 */








function mandelbrot_iter($cx,$cy,$max_betrag_quadrat, $max_iter) {
	$betrag_quadrat = 0;
	$iter = 0;
	$x = 0;
	$y = 0;

	while ($betrag_quadrat <= $max_betrag_quadrat && $iter < $max_iter) {
		$xt = $x * $x - $y*$y + $cx;
		$yt = 2*$x*$y + $cy;
		$x = $xt;
		$y = $yt;
		$iter += 1;
		$betrag_quadrat = $x*$x + $y*$y;
	}
	return $iter;
}

function julia_iter($cx,$cy,$max_betrag_quadrat, $max_iter) {
	$betrag_quadrat = 0;
	$iter = 0;
	$x = $cx;
	$y = $cy;

	while ($betrag_quadrat <= $max_betrag_quadrat && $iter < $max_iter) {
		$xt = $x * $x - $y*$y + 0.353;
		$yt = 2*$x*$y + 0.288;
		$x = $xt;
		$y = $yt;
		$iter += 1;
		$betrag_quadrat = $x*$x + $y*$y;
	}
	return $iter;
}


function choose_color($img, $iters, $max_iters) {
	global $colorPalette;
	$nrOfCols = count($colorPalette);

	$perc = $iters / (float)$max_iters;

	//$col = $colorPalette[min($perc * $nrOfCols,$nrOfCols-1)];
	$col = $colorPalette[$iters % $nrOfCols];
	if ($iters >= $max_iters) return imagecolorallocate($img, 0,0,0);

	$rval = $col['r'];
	$gval = $col['g'];
	$bval = $col['b'];;
	//$gval = sin(2*pi()*$iters);
	//$bval = 255 - (int)($perc*255); // the lesser iterations, the more blue
	return imagecolorallocate($img, $rval, $gval,$bval);
}

// Realteil: -2.2 - 1
// imaginaerteil: -1.4 - 1.4

/*
$min_cx = -2.2;
$max_cx = 1;
$min_cy = -1.4;
$max_cy = 1.4;
*/

/*
$min_cx = -1.14183;
$max_cx = -0.60999;
$min_cy = -0.06128;
$max_cy = 0.47056;
*/
/*
$min_cx = -0.751085;
$max_cx = -0.734975;
$min_cy = 0.118378;
$max_cy = 0.134488;
*/
$picWidth = 800;
$picHeight = 600;

/* Mandelbrot total */
$max_betrag_quadrat = 4;
$max_iter = 40;
$center_cx = -0.7;
$center_cy = 0;
$diameter_cx = 3.0769;

/* Mandelbrot 'seahorse valley' */
/*
$max_betrag_quadrat = 4;
$max_iter = 100;
$center_cx =  -0.87591;
$center_cy = 0.20464;
$diameter_cx = 0.53184;
*/

/* Mandelbrot "Seahorse" upside down */
/*
$max_betrag_quadrat = 4;
$max_iter = 400;
$center_cx =  -0.743030;
$center_cy = 0.126433;
$diameter_cx = 0.016110;
/**/


$fract_scale = $diameter_cx / $picWidth;
$fract_width = $diameter_cx;
$fract_height = $picHeight * $fract_scale;

$min_cx = $center_cx - ($fract_width / 2);
$max_cx = $min_cx + $fract_width;
$min_cy = $center_cy - ($fract_height / 2);
$max_cy = $min_cy + $fract_height;

$punkt_abstand_x = ($max_cx - $min_cx) / (float)$picWidth;
$punkt_abstand_y = ($max_cy - $min_cy) / (float)$picHeight;






// Create the color palette: Every entry is a hash array with 'r','g','b' value.
$colorPalette = array();
$nrOfFades = 7;
$stepsPerFade = $max_iter / $nrOfFades;
$stepSize = 256 / $stepsPerFade;

// Step 1: Fade from Blue to Cyan:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 0,
		'g' => $i,
		'b' => 255
	);
}

// Step 2: Fade from Cyan to Green:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 0,
		'g' => 255,
		'b' => 255 - $i
	);
}

// Step 3: Fade from Green to Yellow:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => $i,
		'g' => 255,
		'b' => 0
	);
}

// Step 4: Fade from Yellow to Red:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 255,
		'g' => 255 - $i,
		'b' => 0
	);
}

// Step 5: Fade from Red to Fuchsia:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 255,
		'g' => 0,
		'b' => $i
	);
}

// Step 6: Fade from Fuchsia to White:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 255,
		'g' => $i,
		'b' => 255
	);
}

// Step 7: Fade from White to Blue:
for ($i = 0; $i < 256; $i+=$stepSize) {
	$colorPalette[] = array(
		'r' => 255 - $i,
		'g' => 255 - $i,
		'b' => 255
	);
}

print "Colors in palette: ".count($colorPalette)."\n";




$img = imagecreatetruecolor($picWidth, $picHeight);
$maxPix = $picWidth * $picHeight;
$count = 0;

for ($pix_x = 1; $pix_x <= $picWidth; $pix_x++) {
	$cx = $min_cx + $pix_x * $punkt_abstand_x; // realteil von Pixelwert errechnet (skaliert)
	for ($pix_y = 1; $pix_y <= $picHeight; $pix_y++) {
		$count++;
		print (int)(100*$count/(float)$maxPix) . "%         \r";
		$cy = $min_cy + $pix_y * $punkt_abstand_y;

		$iter_wert = mandelbrot_iter($cx,$cy,$max_betrag_quadrat, $max_iter);
		//$iter_wert = julia_iter($cx,$cy,$max_betrag_quadrat, $max_iter);
		$col = choose_color($img,$iter_wert, $max_iter);
		imagesetpixel($img, $pix_x, $picHeight-$pix_y, $col);

	}
}

/*
FOR pix_x = 1 TO max_x
    cx = min_cx + pix_x * punkt_abstand_x
 
    FOR pix_y = 1 TO max_y
      cy = min_cy + pix_y * punkt_abstand_y
 
      iterations_wert = punkt_iteration ( cx, cy, max_betrags_quadrat, max_iterationen )
 
      farb_wert = waehle_farbe ( iterations_wert, max_iterationen )
 
      plot pix_x pix_y farb_wert
 
    NEXT pix_y
  NEXT pix_x
*/
imagepng($img,'fractal.png');
imagedestroy($img);
