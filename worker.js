self.addEventListener('message',function(e) {
	if (e.data.msg === 'start') {
		calcFract(e.data.width,e.data.height,e.data.min_cx,e.data.min_cy,e.data.punkt_abstand,e.data.max_betrag_quadrat,e.data.max_iter,e.data);
	}
}, false);






function iter_mandelbrot(cx,cy,max_betrag_quadrat, max_iter) {
	betrag_quadrat = 0;
	iter = 0;
	x = 0;
	y = 0;

	while (betrag_quadrat <= max_betrag_quadrat && iter < max_iter) {
		xt = x * x - y*y + cx;
		yt = 2*x*y + cy;
		x = xt;
		y = yt;
		iter += 1;
		betrag_quadrat = x*x + y*y;
	}
	return iter;

}




function calcFract(width,height,min_cx,min_cy,punkt_abstand,max_betrag_quadrat,max_iter,orig_data) {
	var pix_x,pix_y,cx,cy,iter_wert,index;
	var col = [];
	for (pix_x = 0; pix_x < width; pix_x++) {
		col = [];
		cx = min_cx + pix_x * punkt_abstand; // realteil von Pixelwert errechnet (skaliert)
		for (pix_y = 0; pix_y < height; pix_y++) {
			cy = min_cy + pix_y * punkt_abstand;

			iter_wert = iter_mandelbrot(cx,cy,max_betrag_quadrat, max_iter);
			col.push(iter_wert);
		}
		self.postMessage({msg: 'result',x:pix_x,data: col,orig_data:orig_data});
	}
	self.postMessage({msg: 'done',orig_data:orig_data});
}