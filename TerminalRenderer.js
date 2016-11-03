// const fs = require('fs');
const Canvas = require('canvas');

const DrawilleCanvas = require('drawille-canvas');
// const DrawilleCanvas = require('drawille-canvas-blessed-contrib');

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');

// TODO use a proxy class?
// TODO support WebGLRenderer via headless-gl or node-webgl?
// TODO move terminal dimensions to pixel dimensions conversion here

const ansi = require('./ansi');

class SoftwareCanvas {
    constructor() {
        this.style = {};
    }

    set width(w) {
        this._width = w;
    }

    set height(h) {
        this._height = h;
    }

    getContext() {
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

    fillRect(x, y, w, h) {
        console.error('implement fillRect()')
    }

    getImageData(sx, sy, sw, sh) {
        const result = {
            data: [],
            width: sw,
            height:sh
        }
        return result;
    }

    putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        console.error('implement putImageData()')
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
