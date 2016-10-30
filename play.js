#! /usr/bin/env node

THREE = require('three');

require('three/examples/js/controls/TrackballControls');
require('./TerminalRenderer');

const blessed = require('blessed');
const contrib = require('blessed-contrib');

/*
 * Attempt to use three.js in the terminal / node.js
 * 29 Oct 2016
 *
 * TODOs
 *  - optimize ascii conversion by pull from canvas data
 *  - add nice fps graphs
 *  - make this runs with more examples! (preferably by automating most stuff)
 *  - add docopts to configure parameters
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
 *
 * Also see,
 *  https://threejs.org/examples/canvas_ascii_effect.html
 *  https://github.com/mrdoob/three.js/issues/7085
 *  https://github.com/mrdoob/three.js/issues/2182
 */

let y_scale = 2;
let rendering_scale = 0.05;
width = 640 * rendering_scale;
height = 480 * rendering_scale;

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true
});

screen.title = 'Three.js Terminal';

// placeholder for renderering
const canvas = blessed.image({
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
	parent: screen,
	top: '0',
	left: '0',
	width: 'shrink',
	height: 'shrink',
	content: '{bold}Logs{/bold}\n',
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

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	// TODO should flush or may cause screen corruption!
	// screen.flush();
	// Maybe, send Ctrl-C to it's own process instead
	return process.exit(0);
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

	window.addEventListener('resize', (res) => {
		log(`Resized ${screen.program.columns}, ${screen.program.rows}`);
		const fontWidth = res.width / screen.width;
		const fontHeight = res.height / screen.height;
		y_scale = fontHeight / fontWidth;
		log(`Estimated font size ${fontWidth.toFixed(3)}x${fontHeight.toFixed(3)}, ratio ${y_scale.toFixed(3)}`);

		width = res.width * rendering_scale | 0;
		height = res.height * rendering_scale | 0;
		log(`Rendering using ${width}x${height}px`);

		resize(width, height);
	});
}

function render() {
	const start = Date.now()

	// const timer = Date.now() - start;
	sphere.position.y = Math.abs( Math.sin( start * 0.002 ) ) * 150;
	sphere.rotation.x = start * 0.0003;
	sphere.rotation.z = start * 0.0002;

	controls.update();

	// Render
	renderer.render(scene, camera);

	// Render screen to terminal
	screen.render();

	// // Save canvas
	// saveCanvas();
	const done = Date.now()
	// log('Render time took', done - start);
	frames ++;
}

const start = Date.now();

function log(...args) {
	box.setContent(
		box.getContent() +
		args.join('\t') + '\n');
}

function clearlog() {
	box.setContent('{bold}Logs{/bold}\n');
}

let last = Date.now,
frames = 0;
setInterval( () => {
	const now = Date.now();
	const fps = frames / (now - last) * 1000;
	clearlog()
	log('FPS: ' + fps.toFixed(2))
	last = now;
	frames = 0;
}, 1000)

function resize(w, h) {
	log('resizing');
	controls.handleResize();
	width = w;
	height = h;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}

function saveCanvas() {
	renderer.saveToFile('./test-out4.png')
}

const { scene } = require('./scene');
init();
resize(screen.width, screen.height * y_scale);
setInterval(render, 1);
