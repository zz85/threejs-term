require('three/examples/js/geometries/TeapotBufferGeometry')

const scene = new THREE.Scene();
const light1 = new THREE.PointLight( 0xffffff );
light1.position.set( 500, 500, 500 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 0.25 );
light2.position.set( - 500, - 500, - 500 );
scene.add( light2 );

sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshLambertMaterial() );
// scene.add( sphere );

const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
plane.position.y = - 200;
plane.rotation.x = - Math.PI / 2;
scene.add( plane );

teapot = require('./teapot');
scene.add( teapot );

module.exports = { scene };