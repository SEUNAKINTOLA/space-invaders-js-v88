/**
 * @fileoverview Time utilities for game engine timing and frame rate management
 * Provides functionality for delta time calculation, frame rate monitoring,
 * and time-based game loop operations.
 */

/**
 * Represents a time manager for handling game timing operations
 */
class TimeManager {
    constructor() {
        // Initialize timing properties
        this.lastTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        this.fpsUpdateInterval = 1000; // Update FPS every second
        this.lastFpsUpdate = 0;
        this.currentFps = 0;
        
        // Frame rate limiting
        this.targetFps = 60;
        this.frameDuration = 1000 / this.targetFps;
        this.accumulator = 0;
    }

    /**
     * Initializes the time manager
     * @returns {void}
     */
    init() {
        this.lastTime = performance.now();
        this.lastFpsUpdate = this.lastTime;
        this.frameCount = 0;
    }

    /**
     * Updates timing values for the current frame
     * @returns {number} Delta time in seconds
     */
    update() {
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
            this.currentFps = Math.round(
                (this.frameCount * 1000) / (currentTime - this.lastFpsUpdate)
            );
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }

        return this.deltaTime;
    }

    /**
     * Gets the current frames per second
     * @returns {number}
     */
    getFps() {
        return this.currentFps;
    }

    /**
     * Sets the target frame rate
     * @param {number} fps Target frames per second
     */
    setTargetFps(fps) {
        if (fps <= 0) {
            throw new Error('Target FPS must be greater than 0');
        }
        this.targetFps = fps;
        this.frameDuration = 1000 / fps;
    }

    /**
     * Checks if enough time has passed to process the next frame
     * @returns {boolean}
     */
    shouldProcessFrame() {
        const currentTime = performance.now();
        this.accumulator += currentTime - this.lastTime;
        
        if (this.accumulator >= this.frameDuration) {
            this.accumulator -= this.frameDuration;
            return true;
        }
        return false;
    }

    /**
     * Converts milliseconds to seconds
     * @param {number} ms Time in milliseconds
     * @returns {number} Time in seconds
     */
    static msToSeconds(ms) {
        return ms / 1000;
    }

    /**
     * Converts seconds to milliseconds
     * @param {number} seconds Time in seconds
     * @returns {number} Time in milliseconds
     */
    static secondsToMs(seconds) {
        return seconds * 1000;
    }
}

/**
 * Creates a simple stopwatch for timing operations
 */
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.isRunning = false;
        this.elapsedTime = 0;
    }

    /**
     * Starts the stopwatch
     * @returns {void}
     */
    start() {
        if (!this.isRunning) {
            this.startTime = performance.now();
            this.isRunning = true;
        }
    }

    /**
     * Stops the stopwatch
     * @returns {number} Elapsed time in milliseconds
     */
    stop() {
        if (this.isRunning) {
            this.elapsedTime = performance.now() - this.startTime;
            this.isRunning = false;
        }
        return this.elapsedTime;
    }

    /**
     * Resets the stopwatch
     * @returns {void}
     */
    reset() {
        this.startTime = 0;
        this.isRunning = false;
        this.elapsedTime = 0;
    }

    /**
     * Gets the current elapsed time
     * @returns {number} Elapsed time in milliseconds
     */
    getElapsedTime() {
        if (this.isRunning) {
            return performance.now() - this.startTime;
        }
        return this.elapsedTime;
    }
}

export { TimeManager, Stopwatch };