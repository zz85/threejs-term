const fs = require('fs');
const Canvas = require('canvas');

require('three/examples/js/renderers/Projector');
// require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

// TODO use a proxy class?
// TODO support WebGLRenderer via headless-gl or node-webgl?

const ansi = require('./ansi');

class TerminalRenderer {
    constructor(screen) {
        this.screen = screen;
        // Set up fake canvas
        const canvas = new Canvas()
        canvas.style = {};

        const params = {
            canvas: canvas, // pass in fake canvas
        };

        this.ctx = canvas.getContext('2d');

        // renderer = new THREE.SoftwareRenderer(params); // TODO pass in raw arrays and render that instead
        const renderer = new THREE.CanvasRenderer(params);
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
        this.screen.setContent(c);
    }

    setAnsiOptions(o) {
        ansi.setOptions(o);
    }

    saveRenderToFile(file) {
        // Write canvas to file
        const out = fs.createWriteStream(file);
        return canvas.pngStream().pipe(out);
    }
}

THREE.TerminalRenderer = TerminalRenderer;
module.exports = TerminalRenderer;
