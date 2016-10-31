class FPSCounter {
    constructor() {
        this.bufferSize = 12;
        this.fps = new Array(this.bufferSize).fill(0);
        this.ms = new Array(this.bufferSize).fill(0);

        this.then = Date.now();
        this.frames = 0;
    }

    inc() {
        this.frames++;
    }

    update() {
        const now = Date.now();
        const lapsed = now - this.then;
        const fps = this.frames / lapsed * 1000;
        const ms = lapsed / this.frames;

        if (this.fps.length > this.bufferSize) {
            this.fps.shift();
            this.ms.shift();
        }

        this.fps.push(fps);
        this.ms.push(ms);

        this.frames = 0;
        this.currentFps = fps;
        this.currentMs = ms;
        this.then = now;
    }
}


class MemCounter {
    constructor() {
        this.bufferSize = 12;
        this.data = new Array(this.bufferSize).fill(0);
        this.current;
    }

    update() {
        const rss = process.memoryUsage().rss / 1024 / 1024;
        this.current = rss;

        if (this.data.length > this.bufferSize) {
            this.data.shift();
        }

        this.data.push(rss);
    }
}

module.exports = {
    FPSCounter,
    MemCounter
};