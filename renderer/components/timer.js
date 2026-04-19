export class Timer {
    constructor() {
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
    }

    start() {
        this.startTime = Date.now();
        this.running = true;
    }

    pause() {
        this.elapsed += Date.now() - this.startTime;
        this.running = false;
    }

    resume() {
        this.startTime = Date.now();
        this.running = true;
    }

    stop() {
        if (this.running) {
            this.elapsed += Date.now() - this.startTime;
        }
        this.running = false;
        return this.elapsed;
    }

    getTime() {
        if (!this.running) return this.elapsed;
        return this.elapsed + (Date.now() - this.startTime);
    }
}