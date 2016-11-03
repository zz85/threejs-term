#! /usr/bin/env node
process.env['LANG'] = 'utf8';
process.env['TERM'] = 'xterm-256color';

THREE = require('three');

require('three/examples/js/controls/TrackballControls');
require('./TerminalRenderer');

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const { FPSCounter, MemCounter } = require('./counters');

/*
 * Attempt to use three.js in the terminal / node.js
 * 29 Oct 2016
 *
 * TODOs
 *  - backbuffer screen updates based on network latency?
 *  - try rendering to terminal using drawille / braille characters
 *  - make this runs with more examples! (preferably by automating most stuff)
 *  - add docopts to configure parameters (scale, renderers)
 *  - support webgl and software renderers
 *  - add key controls to adjust parameters inside the terminal (scaling, screenshot, stats, ascii characters)
 *  - try ttystudio
 *  - profit? :D
 *
 * Kinda done-ish
 *  - getting canvas renderer to work
 *  - rendering canvas to fs
 *  - detecting term pixel and columal sizes
 *  - convert to nice ascii effects
 *     (well blessed's ascii image did all the heavy lifting)
 *  - get mouse support for controls
 *  - add key controls too!
 *  - think of a good name for the project
 *  - publish to npm as a cli module!
 *  - modularize This
 *    - Dom Polyfilling
 *    - TerminalRenderer
 *  - add nice fps graphs
 *  - optimize ascii conversion by pulling from canvas data (without png conversion)
 *
 * Also see,
 *  https://threejs.org/examples/canvas_ascii_effect.html
 *  https://github.com/mrdoob/three.js/issues/7085
 *  https://github.com/mrdoob/three.js/issues/2182
 */

let y_scale = 1.23; // pixel ratio of a single terminal character height / width
let pixel_sampling = 1; // mulitplier of target pixels to actual canvas render size
width = 100;
height = y_scale * 50;

// Create a screen object.
const screen = blessed.screen({
	smartCSR: true,
	useBCE: true,
	fastCSR: true,
	autoPadding: true,
	cursor: {
		artificial: true,
		blink: true,
		shape: 'underline'
	},
	fullUnicode: true,
	// log: `${__dirname}/application.log`,
    debug: true,
    dockBorders: true
});

screen.title = 'Three.js Terminal';

// placeholder for renderering
const canvas = blessed.box({ // box image
	parent: screen,
	top: 0,
	left: 0,
	type: 'ansi',
	width: '100%',
	height: '100%',
	//   border: { type: 'line' },
	search: false,
	ascii: true,
	optimization: 'cpu', // cpu mem
	animate: false
});

const box = blessed.box({
	// parent: screen,
	top: '0',
	left: '0',
	width: 'shrink',
	height: 'shrink',
	label: '{bold}Logs{/bold}',
	content: '',
	tags: true,
	border: {
		type: 'line'
	},
	style: {
		fg: 'white',
		// bg: 'magenta',
		border: {
			fg: '#f0f0f0'
		},
		hover: {
			bg: 'green'
		}
	}
});

const sparkline = contrib.sparkline({
	label: 'Stats'
    , tags: true
	, border: {
		type: 'line'
	}
	, style: { fg: '#f08', bg: '#201' } // 0ff 0f0 f08 / 002 020 201 (stats.js colors)
	, width: 'shrink' // 100
	, height: 'shrink' // 160
	, top: '10'
	, right: '0'
	, parent: screen
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	// TODO should flush or may cause screen corruption!
	// screen.flush();
	// Maybe, send Ctrl-C to it's own process instead
	return process.exit(0);
});

mode = 0;

screen.key(['m'], function(ch, key) {
	mode = ++mode % 4;
	let options = {};
	switch (mode) {
		case 0:
			options.plain_formatting = true;
			break;
		case 1:
			options.plain_formatting = false;
			options.bg_formatting = true;
			options.ascii_formatting = false;
			break;
		case 2:
			options.bg_formatting = true;
			options.ascii_formatting = true;
			break;
		case 3:
			options.bg_formatting = false;
			options.ascii_formatting = true;
			break;
	}
	renderer.setAnsiOptions(options);
});

// Focus our element.
canvas.focus();
box.on('click', clearlog);

function init() {
	require('./dom_polyfill')(screen);

	camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
	camera.position.y = 150;
	camera.position.z = 500;

	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed *= 4;
	controls.zoomSpeed *= 4;
	controls.panSpeed *= 4;

	renderer = new THREE.TerminalRenderer(canvas);
	renderer.setClearColor( 0xf0f0f0 );
	// renderer.setClearColor( 0xffffff );

	function onResize(res) {
		if (!res) {
			setSize(screen.width, screen.height * y_scale);
			return;
		}
		screen.debug(`Resized ${screen.program.columns}, ${screen.program.rows}`);
		const fontWidth = res.width / screen.width;
		const fontHeight = res.height / screen.height;
		y_scale = fontHeight / fontWidth;
		screen.debug(`Estimated font size ${fontWidth.toFixed(3)}x${fontHeight.toFixed(3)}, ratio ${y_scale.toFixed(3)}`);

		const actual_screen_ratio = res.height / res.width;

		// target pixels to render
		width = screen.width;
		height = screen.width * actual_screen_ratio;
		screen.debug(`Rendering using ${width}x${height}px`);

		setSize(width, height);
	}

	window.addEventListener('resize', onResize);
	onResize();
}

function render() {
	const start = Date.now()

	// const timer = Date.now() - start;
	sphere.position.y = Math.abs( Math.sin( start * 0.002 ) ) * 150;
	sphere.rotation.x = start * 0.0003;
	sphere.rotation.z = start * 0.0002;

	scene.rotation.y += 0.005;

	controls.update();

	// Render
	renderer.render(scene, camera);

	// Render screen to terminal
	screen.render();

	// // Save canvas
	// saveCanvas();
	const done = Date.now()
	// log('Render time took', done - start);
	fpsCounter.inc();
}

const start = Date.now();

function log(...args) {
	screen.debug(...args);
	// box.setContent(
	// 	box.getContent() +
	// 	args.join('\t') + '\n');
}

function clearlog() {
	box.setContent();
}

fpsCounter = new FPSCounter();
memCounter = new MemCounter();

setInterval( () => {
	clearlog()
	// log('FPS: ' + fps.toFixed(2))
	fpsCounter.update();
	memCounter.update();

	const dataset = [ fpsCounter.fps
		, memCounter.data
		, fpsCounter.ms
		];

	// TODO refactor custom sparkline into it's own widget?
	sparkline.setData(
		[ 'FPS ' + fpsCounter.currentFps.toFixed(2)
			, 'Mem ' + memCounter.current.toFixed(2) + 'MB'
			, 'MS ' + fpsCounter.currentMs.toFixed(2)
			],
		dataset
	);
}, 1000);

function setSize(w, h) {
	width = w * pixel_sampling | 0;
	height = h * pixel_sampling | 0;
	// screen.debug('resizing', w, h, screen.width, screen.height);
	controls.handleResize();
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function saveCanvas() {
	renderer.saveToFile('./test-out4.png')
}

const { scene } = require('./scene');
init();
setInterval(render, 1000 / 60);