<?php

/**
 * See http://de.wikipedia.org/wiki/Mandelbrot-Menge#Grafische_Darstellung:
 * Pseudocode:
 FOR pix_x = 1 TO max_x
    cx = min_cx + pix_x * punkt_abstand_x
 
    FOR pix_y = 1 TO max_y
      cy = min_cy + pix_y * punkt_abstand_y
 
      iterations_wert = punkt_iteration ( cx, cy, max_betrags_quadrat, max_iterationen )
 
      farb_wert = waehle_farbe ( iterations_wert, max_iterationen )
 
      plot pix_x pix_y farb_wert
 
    NEXT pix_y
  NEXT pix_x

  FUNCTION punkt_iteration (cx, cy, max_betrag_quadrat, max_iter)
 
   betrag_quadrat = 0
   iter = 0
   x = 0
   y = 0
 
   WHILE ( betrag_quadrat <= max_betrag_quadrat ) AND ( iter < max_iter )
     xt = x * x - y * y + cx
     yt = 2 * x * y + cy
     x = xt
     y = yt
     iter = iter + 1
     betrag_quadrat = x * x + y * y
   END
 
   punkt_iteration = iter
 
 END FUNCTION
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
	$perc = $iters / (float)$max_iters;
	if ($iters >= $max_iters) return imagecolorallocate($img, 0,0,0);

	$rval = (int)($perc*255); // the more iterations, the more red
	$gval = (int)(2*$perc*255)%255;
	$bval = (int)(4*$perc*255)%255;
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
