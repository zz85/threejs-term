THREE = require('three');
Canvas = require('canvas');

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

/*
 * Attempt to use three.js in node.js
 * 29 Oct 2016
 *
 * Also see,
 *  ascii_effect
 *  https://github.com/mrdoob/three.js/issues/7085
 *  https://github.com/mrdoob/three.js/issues/2182
 */

let width = 640 * 0.25;
let height = 480 * 0.25;

// Set up fake canvas
canvas = new Canvas()
canvas.width = width;
canvas.height = height;
canvas.style = {}

// FakeCanvas = require('./FakeCanvas')
// canvas = new FakeCanvas();

const { scene } = require('./scene');

const camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
camera.position.y = 150;
camera.position.z = 500;

const params = {
    canvas: canvas, // fake
};

// renderer = new THREE.SoftwareRenderer(params); // TODO pass in raw arrays and render that instead
renderer = new THREE.CanvasRenderer(params);
renderer.setClearColor( 0xf0f0f0 );
renderer.setSize( width, height );

renderer.render(scene, camera);

console.log(canvas);

/*
// Write canvas to file
const fs = require('fs');
const out = fs.createWriteStream("./test-out3.png");
const canvasStream = canvas.pngStream().pipe(out);
*/

var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Three.js Terminal';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Add a png icon to the box
var icon = blessed.image({
  parent: screen,
  top: 0,
  left: 0,
  type: 'ansi',
  width: '100%',
  height: '100%',
//   border: { type: 'line' },
  search: false
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();

screen.on('resize', function(e) {
    console.log(e);
});

screen.on('mousedown', function(e) {
    // e.action === 'mousedown';
    console.log('mouse', e.x, e.y, screen.width, screen.height);
})

function render() {
    const timer = Date.now() - start;
    sphere.position.y = Math.abs( Math.sin( timer * 0.002 ) ) * 150;
	sphere.rotation.x = timer * 0.0003;
	sphere.rotation.z = timer * 0.0002;
}

const start = Date.now();

setInterval( () => {
    console.time('render');
    render();
    renderer.render(scene, camera);
    // icon.setImage(canvas.toBuffer())
    // screen.render();
    console.timeEnd('render');
}, 30)
