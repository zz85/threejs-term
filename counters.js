class FPSCounter {
    constructor() {
        this.fps = [];
        this.ms = [];
        this.bufferSize = 12;
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

        this.fps.push(fps);
        this.ms.push(ms);
        
        if (this.fps.length > this.bufferSize) {
            this.fps.shift();
            this.ms.shift();
        }

        this.frames = 0;
        this.currentFps = fps;
        this.currentMs = ms;
        this.then = now;
    }
}


class MemCounter {
    constructor() {
        this.data = []
        this.bufferSize = 12;
        this.current;
    }

    update() {
        const rss = process.memoryUsage().rss / 1024 / 1024;
        this.current = rss;
        this.data.push(rss);
        if (this.data.length > this.bufferSize) {
            this.data.shift();
        }
    }
}

module.exports = {
    FPSCounter,
    MemCounter
};