require('three/examples/js/geometries/TeapotBufferGeometry')

const scene = new THREE.Scene();
const light1 = new THREE.PointLight( 0xffffff );
light1.position.set( 500, 500, 500 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 0.25 );
light2.position.set( - 500, - 500, - 500 );
scene.add( light2 );

sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshLambertMaterial({ wireframe: true, color: 0x9900ee}) );
// scene.add( sphere );

const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
plane.position.y = - 200;
plane.rotation.x = - Math.PI / 2;
scene.add( plane );

teapot = require('./teapot');
// scene.add( teapot );

var geometry = new THREE.BoxGeometry( 200, 200, 200 );
for ( var i = 0; i < geometry.faces.length; i += 2 ) {
    var hex = Math.random() * 0xffffff;
    geometry.faces[ i ].color.setHex( hex );
    geometry.faces[ i + 1 ].color.setHex( hex );
}
var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
cube = new THREE.Mesh( geometry, material );
cube.position.y = 150;
scene.add( cube );

module.exports = { scene };