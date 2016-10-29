THREE = require('three')
// jsdom = require('jsdom');
Canvas = require('canvas');

let width = 640;
let height = 480;

// document = jsdom.jsdom();
// canvas = document.createElement('canvas');

canvas = new Canvas()
canvas.width = width;
canvas.height = height;
ctx = canvas.getContext('2d');
console.log(ctx);

require('three/examples/js/renderers/Projector')
require('three/examples/js/renderers/SoftwareRenderer')
require('three/examples/js/renderers/CanvasRenderer')

const scene = new THREE.Scene();
const light1 = new THREE.PointLight( 0xffffff );
light1.position.set( 500, 500, 500 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 0.25 );
light2.position.set( - 500, - 500, - 500 );
scene.add( light2 );

sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshLambertMaterial() );
scene.add( sphere );

const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
plane.position.y = - 200;
plane.rotation.x = - Math.PI / 2;
scene.add( plane );



const camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
camera.position.y = 150;
camera.position.z = 500;

renderer = new THREE.SoftwareRenderer({
    canvas: canvas, // fake
});

// renderer = new THREE.CanvasRenderer();
renderer.setClearColor( 0xf0f0f0 );
renderer.setSize( width, height );

renderer.render(scene, camera);

console.log(canvas);

const fs = require('fs');
var out = fs.createWriteStream("./test-out2.png");
var canvasStream = canvas.pngStream();
canvasStream.on("data", function (chunk) { out.write(chunk); });
canvasStream.on("end", function() { console.log("done"); });

// fs.writeFile('test-out.png', canvas.toBuffer());