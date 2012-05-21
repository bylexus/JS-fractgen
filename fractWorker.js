var colors;
var workerIndex;

self.addEventListener('message',function(e) {
	if (e.data.msg === 'start') {
		colors = e.data.colors;
		workerIndex = e.data.worker;
		calcFract(e.data);
	}
}, false);




function choose_color(iters, max_iters,x,y,betrag_quadrat) {
	var nrOfCols = colors.length;
	var perc = iters / max_iters;
	var col = colors[iters % nrOfCols];
	if (iters >= max_iters) {
		/*
		if (x % 8  === 0 && y % 8 === 0)	{
			return {r:64,g:64,b:64};
		} else {
			return {r:0,g:0,b:0};
			
		}*/
		return {r:0,g:0,b:0};
		
	}

	return col;
}



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
	return {iterations: iter,betrag_quadrat:betrag_quadrat};

}

function iter_julia(cx,cy,max_betrag_quadrat, max_iter) {
	betrag_quadrat = 0;
	iter = 0;
	x = cx;
	y = cy;

	var julia_cx = -0.8;
	var julia_cy = 0.2;

	while (betrag_quadrat <= max_betrag_quadrat && iter < max_iter) {
		xt = x * x - y*y + julia_cx;
		yt = 2*x*y + julia_cy;
		x = xt;
		y = yt;
		iter += 1;
		betrag_quadrat = x*x + y*y;
	}
	return {iterations: iter,betrag_quadrat:betrag_quadrat};
}




function calcFract(params) {
	var width,height,from_x,to_x,from_y,to_y,min_cx,min_cy,punkt_abstand,max_betrag_quadrat,max_iter,iter_func_txt;
	var pix_x,pix_y,cx,cy,iter_wert,res,punkt_iteration,index;
	var col = [];
	var iter_func = iter_mandelbrot;
	var percDone;

	width  = params.fractParams.pic_width;
	height = params.fractParams.pic_height;
	from_x = params.from_x;
	from_y = params.from_y;
	to_x   = params.to_x;
	to_y   = params.to_y;
	min_cx = params.fractParams.min_cx;
	min_cy = params.fractParams.min_cy;
	punkt_abstand = params.fractParams.punkt_abstand;
	max_betrag_quadrat = params.fractParams.max_betrag_quadrat;
	max_iter = params.fractParams.max_iter;
	iter_func_txt = params.fractParams.iter_func;



	if (iter_func_txt === 'julia') {
		iter_func = iter_julia;
	}
	var calcWidth = to_x - from_x;
	for (pix_x = from_x; pix_x <= to_x; pix_x++) {
		col = [];
		cx = min_cx + pix_x * punkt_abstand; // realteil von Pixelwert errechnet (skaliert)
		for (pix_y = from_y; pix_y <= to_y; pix_y++) {
			cy = min_cy + pix_y * punkt_abstand;

			res = iter_func(cx,cy,max_betrag_quadrat, max_iter);
			iter_wert = res.iterations;
			col.push(choose_color(iter_wert, max_iter,pix_x,pix_y,res.betrag_quadrat));
		}
		percDone = (pix_x-from_x) / calcWidth;
		self.postMessage({msg: 'result',x:pix_x,data: col,params: params,done:percDone});
	}
	self.postMessage({msg: 'done',worker: workerIndex});
}