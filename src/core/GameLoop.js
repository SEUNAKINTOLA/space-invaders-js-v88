/**
 * @fileoverview Game Loop implementation for Space Invaders
 * Handles the main game loop timing, frame updates, and rendering cycles
 */

/**
 * Default target frame rate for the game
 * @constant {number}
 */
const DEFAULT_FPS = 60;

/**
 * Represents the core game loop that manages update and render cycles
 */
class GameLoop {
  /**
   * Creates a new GameLoop instance
   * @param {Object} config - Configuration options
   * @param {number} [config.fps=60] - Target frames per second
   * @param {Function} config.update - Update function to call each frame
   * @param {Function} config.render - Render function to call each frame
   */
  constructor(config) {
    this.fps = config.fps || DEFAULT_FPS;
    this.frameInterval = 1000 / this.fps;
    this.updateFn = config.update;
    this.renderFn = config.render;
    
    // Internal state
    this.running = false;
    this.lastFrameTime = 0;
    this.accumulator = 0;
    this.frameId = null;
    
    // Performance metrics
    this.currentFps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    
    // Bind methods to preserve context
    this.loop = this.loop.bind(this);
    this.calculateFps = this.calculateFps.bind(this);
  }

  /**
   * Starts the game loop
   * @returns {void}
   */
  start() {
    if (this.running) return;
    
    this.running = true;
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = this.lastFrameTime;
    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Stops the game loop
   * @returns {void}
   */
  stop() {
    if (!this.running) return;
    
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Main loop function that handles timing and calls update/render
   * @param {number} currentTime - Current timestamp
   * @private
   */
  loop(currentTime) {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Prevent spiral of death with max frame time
    const maxFrameTime = 250;
    const clampedDelta = Math.min(deltaTime, maxFrameTime);
    
    this.accumulator += clampedDelta;

    // Update game state at fixed time steps
    while (this.accumulator >= this.frameInterval) {
      try {
        this.updateFn(this.frameInterval / 1000); // Convert to seconds
      } catch (error) {
        console.error('Error in update function:', error);
      }
      this.accumulator -= this.frameInterval;
    }

    // Render at whatever frame rate the browser can handle
    try {
      this.renderFn();
    } catch (error) {
      console.error('Error in render function:', error);
    }

    this.calculateFps(currentTime);
    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Calculates and updates the current FPS
   * @param {number} currentTime - Current timestamp
   * @private
   */
  calculateFps(currentTime) {
    this.frameCount++;
    
    // Update FPS counter every second
    if (currentTime > this.lastFpsUpdate + 1000) {
      this.currentFps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastFpsUpdate)
      );
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  /**
   * Gets the current FPS
   * @returns {number} Current frames per second
   */
  getFps() {
    return this.currentFps;
  }

  /**
   * Checks if the game loop is currently running
   * @returns {boolean} True if the loop is running
   */
  isRunning() {
    return this.running;
  }
}

export default GameLoop;