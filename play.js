THREE = require('three')
jsdom = require('jsdom');

document = jsdom.jsdom();
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
console.log(ctx);


// document = {
//     createElement: function(type) {
//         console.log('haha mock');
//     }
// }

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

let width = 640;
let height = 480;

const camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
camera.position.y = 150;
camera.position.z = 500;

// renderer = new THREE.SoftwareRenderer({
    // canvas: {}, // fake
// });

renderer = new THREE.CanvasRenderer();
renderer.setClearColor( 0xf0f0f0 );
renderer.setSize( width, height );

renderer.render(scene, camera);

var out = fs.createWriteStream("./test-out.png");
var canvasStream = canvas.pngStream();
canvasStream.on("data", function (chunk) { out.write(chunk); });
canvasStream.on("end", function () { console.log("done"); });