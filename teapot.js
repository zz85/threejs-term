var teapotSize = 400;
var tess = -1;	// force initialization
effectController = {
    shininess: 40.0,
    ka: 0.17,
    kd: 0.51,
    ks: 0.2,
    metallic: true,

    hue:		0.121,
    saturation: 0.73,
    lightness:  0.66,

    lhue:		 0.04,
    lsaturation: 0.01,	// non-zero so that fractions will be shown
    llightness:  1.0,

    // bizarrely, if you initialize these with negative numbers, the sliders
    // will not show any decimal places.
    lx: 0.32,
    ly: 0.39,
    lz: 0.7,
    newTess: 15,
    bottom: true,
    lid: true,
    body: true,
    fitLid: false,
    nonblinn: false,
    newShading: "glossy"
};

var shading = 'smooth';

// MATERIALS
var materialColor = new THREE.Color();
materialColor.setRGB( 1.0, 1.0, 1.0 );

wireMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } ) ;
flatMaterial = new THREE.MeshPhongMaterial( { color: materialColor, specular: 0x0, shading: THREE.FlatShading, side: THREE.DoubleSide } );
gouraudMaterial = new THREE.MeshLambertMaterial( { color: materialColor, side: THREE.DoubleSide } );
phongMaterial = new THREE.MeshPhongMaterial( { color: materialColor, shading: THREE.SmoothShading, side: THREE.DoubleSide } );

var teapotGeometry = new THREE.TeapotBufferGeometry( teapotSize,
    tess,
    effectController.bottom,
    effectController.lid,
    effectController.body,
    effectController.fitLid,
    ! effectController.nonblinn );

teapot = new THREE.Mesh(
    teapotGeometry,
    shading === "wireframe" ? wireMaterial : (
    shading === "flat" ? flatMaterial : (
    shading === "smooth" ? gouraudMaterial : (
    shading === "glossy" ? phongMaterial : (
     reflectiveMaterial ) ) ) ) );	// if no match, pick Phong

teapot.scale.multiplyScalar(0.4);

module.exports = teapot;