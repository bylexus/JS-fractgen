




var colorScheme = [];
var colorPalette = [];
var hist = [];
var initial_diameter = null;









var fractParams = {};


function pushHist(params, imageData) {
	hist.push({
		fractParams: params.clone(),
		imageData: imageData,
		colorScheme: colorScheme.clone()
	});
	if (hist.length > 1) {
		$('#backBtn').attr('disabled',false);
	}
}

function popHist() {
	$('#backBtn').attr('disabled',true);
	if (hist.length > 1) {
		var context = $('#fractCanvas')[0].getContext("2d");
		hist.pop();
		var h = hist[hist.length-1];
		fractParams = h.fractParams.clone();
		colorScheme = h.colorScheme.clone();
		loadPreset(fractParams);
		init();
		context.putImageData(h.imageData,0,0);
		createColorPalette();
		drawColorPalette();
		updateInfo();

		if (hist.length > 1) {
			$('#backBtn').attr('disabled',false);
		}
	}
}



function drawFract() {
	var workers = [];
	var worker;
	var i;
	var nrOfWorkers = fractParams.nrOfWorkers || 2;
	var canvas = $('#fractCanvas')[0];
    var context = canvas.getContext("2d");
    var imageData;
    var startTime;
    var endTime;

    context.clearRect(0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0,0,fractParams.pic_width, fractParams.pic_height);

    startTime = new Date();
    $('#progressBars').empty();
	for (i = 0; i < nrOfWorkers; i++) {
		worker = new Worker('fractWorker.js');
		workers.push({worker:worker,done: false});

		$('#progressBars').append('<div>Progress Worker '+i+': <div style="display:inline-block;border:1px solid #888;width: 400px;"><div id="progress'+i+'" style="width: 0%;background-color: blue;">&nbsp;</div></div><img id="loader'+i+'" src="loader.gif" border="" /></div>');

		(function(w,windex){
			var pBar = $('#progress'+windex);
			w.addEventListener('message',function(e) {
		    	if (e.data.msg === 'result') {
		    		for (var j = 0; j < e.data.data.length;j++) {
		    			col = e.data.data[j];
						index = (e.data.x + (fractParams.pic_height - (e.data.params.from_y+j) - 1)* imageData.width) * 4;
						imageData.data[index+0] = col.r;
						imageData.data[index+1] = col.g;
						imageData.data[index+2] = col.b;
						imageData.data[index+3] = 255;
		    		}
		    		if (e.data.x % 30 === 0) {
		    			// only update progress bar every 30th result:
		    			pBar.css('width',Math.floor(e.data.done*100)+"%");
		    			//pBar.html(Math.floor(e.data.done*100)+"%");
		    		}
		    		
		    	}
		    	if (e.data.msg === 'done') {
		    		workers[e.data.worker].done = true;
		    		pBar.css('width',"100%");
		    		$('#loader'+e.data.worker).hide();
		    		var checkDone = true;
		    		for (var wi = 0; wi < workers.length;wi++) {
		    			if (workers[wi].done !== true) {
		    				checkDone = false;
		    			}
		    		}
		    		if (checkDone) {
		    			pushHist(fractParams,imageData);
		    			context.putImageData(imageData,0,0);
		    			endTime = new Date();
						updateInfo(endTime.getTime() - startTime.getTime());
		    		}
		    	}
		    	if (e.data.msg === 'log') {
		    		console.log(e.data.data);
		    	}
			
			});
		    var msg = {
				msg: 'start',
				worker: windex,
				fractParams: fractParams,
				from_x: ((fractParams.pic_width/nrOfWorkers)|0)*i,
				from_y: 0,
				to_x: ((fractParams.pic_width/nrOfWorkers)|0)*(i+1)-1,
				to_y: fractParams.pic_height-1,
				colors: colorPalette
			};
			w.postMessage(msg);
		})(worker,i);
	}
}

function updateInfo(milisecsUsed) {
	$('#iterInfo').html(fractParams.max_iter);
	$('#minXInfo').html(fractParams.min_cx);
	$('#minYInfo').html(fractParams.min_cy);
	$('#maxXInfo').html(fractParams.max_cx);
	$('#maxYInfo').html(fractParams.max_cy);
	$('#zoomInfo').html(initial_diameter / fractParams.diameter_cx);
	$('#timeInfo').html(milisecsUsed + " ms");
	drawColorPalette();
}


function init() {
	fractParams = presets[$('#presets').val()].clone();
	fractParams.pic_width = Number($('#pic_width').val());
	fractParams.pic_height = Number($('#pic_height').val());

	fractParams.center_cx = Number($('#center_cx').val());
	fractParams.center_cy = Number($('#center_cy').val());

	fractParams.diameter_cx = Number($('#diameter_x').val());
	fractParams.max_iter = Number($('#max_iter').val());
	fractParams.max_betrag_quadrat = Number($('#max_betrag_quadrat').val());
	fractParams.iter_func = $('#iter_func').val();
	fractParams.nrOfWorkers = Number($('#nr_of_workers').val());

	fractParams.k_r = Number($('#julia_r').val());
	fractParams.k_i = Number($('#julia_i').val());

	if (initial_diameter == null) {
		initial_diameter = fractParams.diameter_cx;
	}
	var aspect, fract_width, fract_height;
	$('#fractCanvas').width(fractParams.pic_width);
	$('#fractCanvas').height(fractParams.pic_height);
	$('#fractCanvas').attr('width',fractParams.pic_width);
	$('#fractCanvas').attr('height',fractParams.pic_height);

	aspect = fractParams.pic_width / fractParams.pic_height;
	fract_width = fractParams.diameter_cx;
	fract_height = fractParams.diameter_cx / aspect;

	fractParams.min_cx = fractParams.center_cx - (fract_width / 2);
	fractParams.max_cx = fractParams.min_cx + fract_width;
	fractParams.min_cy = fractParams.center_cy - (fract_height / 2);
	fractParams.max_cy = fractParams.min_cy + fract_height;

	fractParams.punkt_abstand = (fractParams.max_cx - fractParams.min_cx) / fractParams.pic_width;

	createColorPalette();
	drawColorPalette();
}

function createColorPalette() {
	// Init color palette
	colorPalette = [];
	var baseColors = colorScheme.colors;
	var stepsPerFade = fractParams.max_iter / (baseColors.length-1);
	var actBase;
	var nextBase;
	var rStep,gStep,bStep;
	var r,g,b;

	for (var i = 0; i < baseColors.length - 1; i++) {
		actBase = baseColors[i];
		nextBase = baseColors[i+1];
		r = actBase.r;
		g = actBase.g;
		b = actBase.b;
		rStep = (nextBase.r-actBase.r) / stepsPerFade;
		bStep = (nextBase.b-actBase.b) / stepsPerFade;
		gStep = (nextBase.g-actBase.g) / stepsPerFade;
		for (var j = 0; j < stepsPerFade;j++) {
			colorPalette.push({
				r:r|0,
				g:g|0,
				b:b|0
			});
			r += rStep;
			g += gStep;
			b += bStep;
		}
	}
}


function drawColorPalette() {
	var cont = $('#colorPalette');
	var el;
	var r,g,b;
	var paletteWidth = 800;
	cont.empty();
	var index = 0;
	for (var i = 0; i < paletteWidth; i++) {
		index = Math.floor(i/paletteWidth*colorPalette.length);
		r = colorPalette[index].r;
		g = colorPalette[index].g;
		b = colorPalette[index].b;
		el = $('<div style="display:inline-block; width:1px; height: 20px;background-color: rgb('+r+','+g+','+b+');"></div>');
		cont.append(el);
	}
}


function loadPreset(preset) {
	$('#pic_width').val(preset.pic_width);
	$('#pic_height').val(preset.pic_height);

	$('#center_cx').val(preset.center_cx);
	$('#center_cy').val(preset.center_cy);

	$('#diameter_x').val(preset.diameter_cx);

	$('#max_iter').val(preset.max_iter);
	$('#max_betrag_quadrat').val(preset.max_betrag_quadrat);
	$('#iter_func').val(preset.iter_func);
	$('#nr_of_workers').val(preset.nrOfWorkers);

	if (preset.iter_func === 'julia') {
		$('#julia_params').show();
	} else {
		$('#julia_params').hide();
	}

	if (preset.k_r) {
		$('#julia_r').val(preset.k_r);
	}
	if (preset.k_i) {
		$('#julia_i').val(preset.k_i);
	}
}

function setActiveColorScheme(nr) {
	colorScheme = colorPresets[nr];
}


function onPageReady() {
	var i;

	// Fill presets select:
	var presetsSelect = $('#presets').empty();
	var el;
	for (i in presets) {
		if (i != 'clone') {
			el = $('<option value="'+i+'">'+presets[i].name+'</option>');
			presetsSelect.append(el);
		}
	}
	loadPreset(presets[presetsSelect.first().val()]);
	presetsSelect.on('change',function() {
		loadPreset(presets[$(this).val()]);
	});


	// Fill color scheme select:
	var colSchemeSelect = $('#colors').empty();
	for (i = 0; i < colorPresets.length; i++) {
		el = $('<option value="'+i+'">'+colorPresets[i].name+'</option>');
		colSchemeSelect.append(el);
	}
	setActiveColorScheme(colSchemeSelect.first().val());
	colSchemeSelect.on('change',function() {
		setActiveColorScheme($(this).val());
		createColorPalette();
		drawColorPalette();
	});

	init();

}


$(document).ready(function(){
	onPageReady();


	$('#startCalcBtn').on('click',function() {
		init();
		drawFract();
	});

	$('#backBtn').on('click',function() {
		popHist();
	});
	$('#backBtn').attr('disabled',true);

	$('#savePngBtn').on('click',function() {
		$('#outputImage')[0].src = $('#fractCanvas')[0].toDataURL('image/png');
		$(document).scrollTop($('#outputImage').offset().top);
	});

	$('#iter_func').on('change', function() {
		if ($(this).val() === 'julia') {
			$('#julia_params').show();
		} else {
			$('#julia_params').hide();
		}
	});




	


	$('#fractCanvas').data('mouseIsDown',false);
	$('#fractCanvas').data('mouseMoved',false);

	$('#fractCanvas').on('mousedown', function(ev){
		var offsetX = ev.pageX - $(this).offset().left;
		var offsetY = ev.pageY - $(this).offset().top;

		$('#fractCanvas').data('mouseIsDown',true);
		$('#fractCanvas').data('mouseDownX',offsetX);
		$('#fractCanvas').data('mouseDownY',offsetY);
		$('#fractCanvas').data('mouseMoved',false);

		$('#canvasContainer .markBox').remove();
		var markBox = $('<div class="markBox" style="position: absolute; border: 2px solid white;z-index:10000"></div>');
		markBox.css('left',offsetX+'px');
		markBox.css('top',offsetY+'px');
		markBox.css('width','0');
		markBox.css('height','0');



		markBox.on('mouseup', function(ev) {
			$('#fractCanvas').data('mouseIsDown',false);
			if ($('#fractCanvas').data('mouseMoved')) {

				var pixelCenterX = (($(this).width()/2+$(this).position().left)) | 0;
				var pixelCenterY = (($(this).height()/2+$(this).position().top)) | 0;

				var newDiameter_cx = $(this).width() / fractParams.pic_width * fractParams.diameter_cx;

				$('#diameter_x').val(newDiameter_cx);
				var scaleFactor = fractParams.initial_diameter_cx / newDiameter_cx;
				$('#max_iter').val((fractParams.initial_iter*(Math.pow(1.3,Math.log(scaleFactor)/Math.log(2))))|0);

				$('#center_cx').val(fractParams.min_cx + pixelCenterX * fractParams.punkt_abstand);
				$('#center_cy').val(fractParams.max_cy - pixelCenterY * fractParams.punkt_abstand);

				
			} else {
				var offsetX, offsetY;

				$('#diameter_x').val($('#diameter_x').val()*0.5);
				$('#max_iter').val(($('#max_iter').val()*1.3)|0);

				offsetX = $(this).position().left;
				offsetY = $(this).position().top;

				$('#center_cx').val(fractParams.min_cx + offsetX * fractParams.punkt_abstand);
				$('#center_cy').val(fractParams.max_cy - offsetY * fractParams.punkt_abstand);
			}
			$('#canvasContainer .markBox').remove();
				init();
				drawFract();
		});
		$('#canvasContainer').append(markBox);

	});

	$('#fractCanvas').on('mousemove', function(ev){
		if ($('#fractCanvas').data('mouseIsDown')) {
			var offsetX = ev.pageX - $(this).offset().left;
			var offsetY = ev.pageY - $(this).offset().top;
			$('#fractCanvas').data('mouseMoved',true);

			var markBox = $('#canvasContainer .markBox');
			markBox.css('width',(offsetX - markBox.position().left) + 'px');
			markBox.css('height',(offsetY - markBox.position().top) + 'px');

		}
	});

});