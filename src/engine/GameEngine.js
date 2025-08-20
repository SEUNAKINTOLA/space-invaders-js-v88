/**
 * @fileoverview Core Game Engine implementation providing game loop and canvas rendering
 * @module GameEngine
 */

/**
 * Core Game Engine class handling the game loop, canvas rendering, and game object management
 */
class GameEngine {
  /**
   * Creates a new GameEngine instance
   * @param {Object} config - Engine configuration object
   * @param {number} config.width - Canvas width in pixels
   * @param {number} config.height - Canvas height in pixels
   * @param {number} config.fps - Target frames per second
   * @param {string} config.canvasId - DOM ID for the canvas element
   */
  constructor(config) {
    // Validate required config
    if (!config || !config.width || !config.height || !config.fps || !config.canvasId) {
      throw new Error('Invalid engine configuration');
    }

    // Engine state
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.fps = config.fps;
    this.frameInterval = 1000 / this.fps;

    // Game objects collection
    this.gameObjects = new Set();
    
    // Setup canvas
    this.setupCanvas(config);
    
    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
  }

  /**
   * Sets up the canvas and rendering context
   * @private
   * @param {Object} config - Engine configuration
   * @throws {Error} If canvas element cannot be found or context cannot be obtained
   */
  setupCanvas(config) {
    this.canvas = document.getElementById(config.canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${config.canvasId}' not found`);
    }

    this.canvas.width = config.width;
    this.canvas.height = config.height;
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
  }

  /**
   * Starts the game engine
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Stops the game engine
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Main game loop
   * @private
   * @param {number} currentTime - Current timestamp
   */
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time
    this.deltaTime = currentTime - this.lastFrameTime;

    // Check if it's time for the next frame
    if (this.deltaTime >= this.frameInterval) {
      // Update timing
      this.lastFrameTime = currentTime - (this.deltaTime % this.frameInterval);

      // Clear canvas
      this.clear();

      // Update and render game objects
      this.update(this.deltaTime / 1000); // Convert to seconds
      this.render();
    }

    // Schedule next frame
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Updates all game objects
   * @param {number} deltaTime - Time elapsed since last update in seconds
   */
  update(deltaTime) {
    for (const gameObject of this.gameObjects) {
      if (typeof gameObject.update === 'function') {
        gameObject.update(deltaTime);
      }
    }
  }

  /**
   * Renders all game objects
   */
  render() {
    for (const gameObject of this.gameObjects) {
      if (typeof gameObject.render === 'function') {
        gameObject.render(this.ctx);
      }
    }
  }

  /**
   * Clears the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Adds a game object to the engine
   * @param {Object} gameObject - Game object to add
   * @throws {Error} If game object is invalid
   */
  addGameObject(gameObject) {
    if (!gameObject || typeof gameObject !== 'object') {
      throw new Error('Invalid game object');
    }
    this.gameObjects.add(gameObject);
  }

  /**
   * Removes a game object from the engine
   * @param {Object} gameObject - Game object to remove
   */
  removeGameObject(gameObject) {
    this.gameObjects.delete(gameObject);
  }

  /**
   * Gets the current canvas context
   * @returns {CanvasRenderingContext2D} The 2D rendering context
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Gets the canvas dimensions
   * @returns {Object} Object containing canvas width and height
   */
  getCanvasDimensions() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }
}

export default GameEngine;