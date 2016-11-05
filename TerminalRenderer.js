'use strict'

const fs = require('fs');
const Canvas = require('canvas');

const DrawilleCanvas = require('drawille');
const SoftwareCanvas = require('./SoftwareCanvas');

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

// TODO support WebGLRenderer via headless-gl or node-webgl?
// TODO move terminal dimensions to pixel dimensions conversion here

const ansi = require('./ansi');

class TerminalRenderer {
    constructor(screen) {
        this.screen = screen;
        this.pixel_sampling = 1; // mulitplier of target pixels to actual canvas render size

        // Set up fake canvas
        const canvas = new Canvas();
        // const canvas = new SoftwareCanvas();
        canvas.style = {};

        const params = {
            canvas: canvas, // pass in fake canvas
        };

        this.ctx = canvas.getContext('2d');

        // const renderer = new THREE.SoftwareRenderer(params); // TODO pass in raw arrays and render that instead
        const renderer = new THREE.CanvasRenderer(params);
        this.canvas = canvas;
        this.renderer = renderer;

        this.drawille = new DrawilleCanvas();
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
        const multiplier = (this.braille ? 4 : 1) * this.pixel_sampling;
        w = w * multiplier | 0;
        h = h * multiplier | 0;
        this.renderer.setSize(w, h);
    }

    setClearColor(c) {
        this.renderer.setClearColor(c);
    }

    render(scene, camera) {
        // console.error(`Size ${this.canvas.width},${this.canvas.height} ${this.screen.width},${this.screen.height} `);

        this.renderer.render(scene, camera);

        // A) only for AnsiImage widget
        // seems to be faster but less configurable
        // this.screen.setImage(this.canvas.toBuffer())

        this.image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        if (!this.braille) {
            // B) Convert to ASCII and render
            this.screen.setContent(ansi.convert(this.image, this.screen.width, this.screen.height));
        }
        else {
            // C) Do Draville something.
            this.renderDrawille(this.image, this.screen);
        }

        // D) Render to file

    }

    renderDrawille(image, screen) {
        const tw = screen.width * 2;
        const th = screen.height * 4;

        const sw = image.width;
        const sh = image.height;
        const data = image.data;

        const drawille = this.drawille;
        drawille.width = tw;
        drawille.height = th;
        drawille.clear();

        let tx, ty, p, r, g, b, a, intensity;
        for (let y = 0; y < th; y++) {
            for (let x = 0; x < tw; x++) {
                tx = x / tw * sw | 0;
                ty = y / th * sh | 0;
                p = (ty * sw + tx) * 4;

                r = data[p + 0] / 255;
                g = data[p + 1] / 255;
                b = data[p + 2] / 255;
                a = data[p + 3] / 255;

                intensity = (0.2126 * r + 0.7152 * g + 0.0722 * b) * a;
                if (intensity < 0.8) drawille.set(x, y);
            }
        }

        screen.setContent(drawille.frame());
    }

    setAnsiOptions(o) {
        ansi.setOptions(o);
    }

    setBrailleMode(mode) {
        this.braille = mode;

        this.setSize(this.width, this.height);
    }

    setPixelScale(s) {
        this.pixel_sampling = s;
        this.setSize(this.width, this.height);
    }

    saveRenderToFile(canvas, file) {
        // Write canvas to file
        const out = fs.createWriteStream(file);
        return canvas.pngStream().pipe(out);
    }
}

THREE.TerminalRenderer = TerminalRenderer;
module.exports = TerminalRenderer;
