// const fs = require('fs');
const Canvas = require('canvas');

const DrawilleCanvas = require('drawille-canvas');
// const DrawilleCanvas = require('drawille-canvas-blessed-contrib');

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

// TODO support WebGLRenderer via headless-gl or node-webgl?
// TODO move terminal dimensions to pixel dimensions conversion here

const ansi = require('./ansi');

class SoftwareCanvas {
    constructor() {
        this.style = {};
    }

    set width(w) {
        this._width = w;
        this._resize()
    }

    set height(h) {
        this._height = h;
        this._resize()
    }

    _resize() {
        this._data = new Uint8ClampedArray(this._width * this._height * 4);
    }

    getContext() {
        // Use proxy to trap unhandled messages
        const proxy = new Proxy(this, {
            get: function (object, property, proxy) {
                if (property in object) {
                    return object[property];
                }

                console.error('Trapped get',  property);
                return null;
            },

            set: function(object, property, value, proxy) {
                if (!(property in object)) {
                    console.error('Trapped set',  property, value);
                }

                object[property] = value;
                return object[property];
            }
        });

        return proxy;
    }

    fillRect(sx, sy, w, h) {
        // console.error('implement fillRect()')
        const [r, g, b, a] = this._parseStyle(this.fillStyle);
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                const x = i + sx;
                const y = j + sy;

                const si = (y * this._width + x) * 4;
                // TODO Need to blend!!!
                this._data[si + 0] = r;
                this._data[si + 1] = g;
                this._data[si + 2] = b;
                this._data[si + 3] = a;
            }
        }
    }

    _parseStyle(s) {
        const RGB = /rgb\s*\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)/
        let match = RGB.exec(s);
        if (match) {
            return [...match.slice(1), 255];
        }

        const RGBA = /rgba\s*\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)/
        match = RGBA.exec(s);
        if (match)
            return match.slice(1);
        elsef
            console.error('Cannot parse', s);
        return [0, 0, 0, 0];
    }

    /*
    set fillStyle(x) {

    }*/

    getImageData(sx, sy, sw, sh) {
        const data = new Uint8ClampedArray(sw * sh * 4);
        // TODO this doesn't check boundary conditions!

        for (let j = 0; j < sh; j++) {
            for (let i = 0; i < sw; i++) {
                const x = sx + i;
                const y = sy + j;

                const source = (y * this._width + x) * 4;
                const dest = (j * sw + i) * 4;
                data[dest + 0] = this._data[source + 0];
                data[dest + 1] = this._data[source + 1];
                data[dest + 2] = this._data[source + 2];
                data[dest + 3] = this._data[source + 3];
            }
        }

        const result = {
            data: data,
            width: sw,
            height: sh
        }
        return result;
    }

    putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        // imagedata, 0, 0, x, y, width, height
        // console.error('implement putImageData()')
        const data = imageData.data;

        for (let y = 0; y < dirtyHeight; y++) {
            for (let x = 0; x < dirtyWidth; x++) {
                const tx = dirtyX + x;
                const ty = dirtyY + y;
                const sx = dx + x;
                const sy = dy + y;

                const source = (ty * imageData.width + tx) * 4;
                const dest = (sy * this._width + sx) * 4;
                this._data[dest + 0] = data[source + 0];
                this._data[dest + 1] = data[source + 1];
                this._data[dest + 2] = data[source + 2];
                this._data[dest + 3] = data[source + 3];
            }
        }
    }
}


class TerminalRenderer {
    constructor(screen) {
        this.screen = screen;
        // Set up fake canvas
        // const canvas = new Canvas(400, 300);
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

    saveRenderToFile(file) {
        // Write canvas to file
        const out = fs.createWriteStream(file);
        return canvas.pngStream().pipe(out);
    }
}

THREE.TerminalRenderer = TerminalRenderer;
module.exports = TerminalRenderer;
