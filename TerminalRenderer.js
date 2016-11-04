const fs = require('fs');
const Canvas = require('canvas');

const DrawilleCanvas = require('drawille-canvas');
// const DrawilleCanvas = require('drawille-canvas-blessed-contrib');
const SoftwareCanvas = require('./SoftwareCanvas')

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

// TODO support WebGLRenderer via headless-gl or node-webgl?
// TODO move terminal dimensions to pixel dimensions conversion here

const ansi = require('./ansi');



class TerminalRenderer {
    constructor(screen) {
        this.screen = screen;
        // Set up fake canvas
        // const canvas = new Canvas();
        // const canvas = new DrawilleCanvas.Canvas(120, 60);
        const canvas = new SoftwareCanvas();
        canvas.style = {};

        const params = {
            canvas: canvas, // pass in fake canvas
        };

        this.ctx = canvas.getContext('2d');

        const renderer = new THREE.SoftwareRenderer(params); // TODO pass in raw arrays and render that instead
        // const renderer = new THREE.CanvasRenderer(params);
        this.canvas = canvas;
        this.renderer = renderer;
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
        this.renderer.setSize(w, h);
    }

    setClearColor(c) {
        this.renderer.setClearColor(c);
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
        // this.screen.setImage(this.canvas.toBuffer()); // only for AnsiImage widget // seems to be faster but less configurable
        // console.error(`Size ${this.width},${this.height} ${this.screen.width},${this.screen.height} `);

        this.image = this.ctx.getImageData(0, 0, this.width, this.height);
        const c = ansi.convert(this.image, this.screen.width, this.screen.height)

        // const c = this.ctx.canvas.frame();
        this.screen.setContent(c);
    }

    setAnsiOptions(o) {
        ansi.setOptions(o);
    }

    saveRenderToFile(canvas, file) {
        // Write canvas to file
        const out = fs.createWriteStream(file);
        return canvas.pngStream().pipe(out);
    }
}

THREE.TerminalRenderer = TerminalRenderer;
module.exports = TerminalRenderer;
