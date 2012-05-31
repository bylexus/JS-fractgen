var fractParamsMandelbrot = {
	/* Mandelbrot Total as default params */
	max_betrag_quadrat: 4,
	max_iter: 40,
	center_cx: -0.7,
	center_cy: 0,
	diameter_cx: 3.0769,
	initial_diameter_cx: 3.0769, // used for calculating the relative scale factor
	initial_iter: 40, // used for calculating the relative scale factor
	iter_func: 'mandelbrot',
	pic_width: 800,
	pic_height: 600,
	min_cx: 0.0,
	max_cx: 0.0,
	min_cy: 0.0,
	max_cy: 0.0,
	punkt_abstand: 0.0,
	nrOfWorkers: 2
};

var presets = {
	mandelbrot_total: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Total'
	}),
	mandelbrot_seahorse_valley: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Seahorse Valley',
		max_iter: 100,
		center_cx:  -0.87591,
		center_cy:  0.20464,
		diameter_cx:0.53184
	}),

	mandelbrot_seahorse_upside_down: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Seahorse Upside Down',
		max_iter: 400,
		center_cx:  -0.743030,
		center_cy:  0.126433,
		diameter_cx:0.016110
	}),

	mandelbrot_seahorse_tail: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Seahorse Tail',
		max_iter: 500,
		center_cx:  -0.7435669,
		center_cy:  0.1314023,
		diameter_cx:0.0022878
	}),

	mandelbrot_satellite: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Antenna Satellite',
		max_iter: 3000,
		center_cx:  -0.743644786,
		center_cy:  0.1318252536,
		diameter_cx:.0000029336,
		nrOfWorkers: 4
	}),

	mandelbrot_seahorse_valley_satellite: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Seahorse Valley of the Satellite',
		max_iter: 3000,
		center_cx:  -0.74364409961,
		center_cy:  0.13182604688,
		diameter_cx:0.00000066208,
		nrOfWorkers: 4
	}),

	mandelbrot_snowstat: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Snowstar',
		max_iter: 400,
		center_cx:  0.20070234179688,
		center_cy:  -0.56375779101563,
		diameter_cx:0.02403828125
	}),

	mandelbrot_lexus_secret: ObjectMerge(fractParamsMandelbrot,{
		name: 'Mandelbrot Lexus\' Secret Spot',
		max_iter: 2500,
		center_cx:  -0.2379717670706691,
		center_cy:  0.8451734844686328,
		diameter_cx:0.000036573043007812505
	}),

	

	julia_total: ObjectMerge(fractParamsMandelbrot, {
		name: 'Julia Total',
		max_iter: 80,
		center_cx: 0,
		center_cy: 0,
		k_r: -0.8,
		k_i: 0.2,
		diameter_cx: 3.0769,
		iter_func: 'julia',
		initial_diameter_cx: 3.0769, // used for calculating the relative scale factor
		initial_iter: 80, // used for calculating the relative scale factor
	})

};

var colorPresets = [{
	name: 'Patchwork',
	colors: [
	{r:0,g:0,b:30},
	{r:253,g:204,b:6},
	{r:186,g:84,b:15},
	{r:0,g:0,b:255},
	{r:180,g:180,b:30},
	{r:103,g:61,b:135},
	{r:255,g:0,b:0},
	{r:0,g:0,b:30},
	{r:255,g:255,b:255},
	{r:230,g:0,b:230},
	{r:0,g:0,b:30},
	{r:255,g:0,b:0},
	{r:255,g:255,b:0},
	{r:255,g:255,b:255}
	]},{
		name: 'Shades of Blue',
		colors: [
		{r:0,g:0,b:30},
		{r:128,g:128,b:255},
		{r:200,g:200,b:255},
		{r:64,g:64,b:192},
		{r:0,g:0,b:30},
		{r:200,g:200,b:255},
		{r:0,g:0,b:30},
		{r:128,g:128,b:255},
		{r:200,g:200,b:255},
		{r:64,g:64,b:192},
		{r:0,g:0,b:30},
		{r:200,g:200,b:255},
		{r:0,g:0,b:30},
		{r:128,g:128,b:255},
		{r:200,g:200,b:255},
		{r:64,g:64,b:192},
		{r:0,g:0,b:30},
		{r:200,g:200,b:255},
	]}, {
		name: "Women's Choice",
		colors: [
			{r:30,g:5,b:25},
			{r:255,g:102,b:204},
			{r:255,g:179,b:232},
			{r:128,g:0,b:89},
			{r:255,g:204,b:255},
			{r:30,g:5,b:25},
			{r:255,g:102,b:204},
			{r:255,g:179,b:232},
			{r:128,g:0,b:89},
			{r:255,g:204,b:255},
			{r:30,g:5,b:25},
			{r:255,g:102,b:204},
			{r:255,g:179,b:232},
			{r:128,g:0,b:89},
			{r:255,g:204,b:255}
		]
	}, {
		name: "Black or White",
		colors: [
			{r:0,g:0,b:0},
			{r:60,g:60,b:60},
			{r:255,g:255,b:255},
			{r:60,g:60,b:60},
			{r:0,g:0,b:0},
			{r:255,g:255,b:255},
			{r:0,g:0,b:0},
			{r:60,g:60,b:60},
			{r:255,g:255,b:255},
			{r:60,g:60,b:60},
			{r:0,g:0,b:0},
			{r:255,g:255,b:255}
		]
	}, {
		name: "Nature",
		colors: [
			{r:0,g:51,b:102},
			{r:99,g:255,b:20},
			{r:255,g:255,b:255},
			{r:102,g:51,b:0},
			{r:255,g:255,b:143}
		]
	}, {
		name: "Base Colors",
		colors: [
			{r:0,g:0,b:0},
			{r:0,g:0,b:255},
			{r:255,g:0,b:255},
			{r:255,g:0,b:0},
			{r:255,g:255,b:0},
			{r:0,g:255,b:0},
			{r:0,g:255,b:255},
			{r:255,g:255,b:255}
		]
	}
];