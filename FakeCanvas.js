class FakeCanvas {
    constructor() {
        this.style = {};
    }

    set width(w) {
        this._width = w;
        this.resize();
    }

    get width() {
        return this._width;
    }

    set height(h) {
        this._height = h;
        this.resize();
    }

    getContext() {
        return new FakeContext(this);
    }

    resize() {

    }
}

class FakeContext {
    constructor(canvas) {
        this.canvas;
    }

    clearRect() {

    }

    fillRect() {

    }

    drawImage() {

    }

    getImageData(x, y, w, h) {
        this.data = new ImageFakeData(w, h);
        return this.data;
    }

    putImageData(data) {

    }
}

function ImageFakeData(w, h) {
    this.data = new Uint8ClampedArray(w * h * 4);
    this.width = w;
    this.height = h;
}

module.exports = FakeCanvas;