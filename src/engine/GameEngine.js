/**
 * @fileoverview Core Game Engine implementation providing game loop, canvas rendering, and state management
 * @module GameEngine
 */

/**
 * Core Game Engine class handling the game loop, canvas rendering, game object management,
 * and coordinating all game systems.
 */
class GameEngine {
  /**
   * Creates a new GameEngine instance
   * @param {Object} config - Engine configuration object
   * @param {number} config.width - Canvas width in pixels (optional if canvasId provided)
   * @param {number} config.height - Canvas height in pixels (optional if canvasId provided)
   * @param {number} config.fps - Target frames per second (default: 60)
   * @param {string} config.canvasId - DOM ID for the canvas element (optional)
   * @param {boolean} config.debug - Enable debug mode (default: false)
   */
  constructor(config = {}) {
    // Validate and set configuration
    this.fps = config.fps || 60;
    this.debug = config.debug || false;
    this.frameInterval = 1000 / this.fps;

    // Core engine state
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.frameCount = 0;

    // Game objects and systems collection
    this.gameObjects = new Set();
    this.systems = new Map();
    this.entities = new Set();
    
    // Canvas setup if configuration provided
    if (config.canvasId || (config.width && config.height)) {
      this.setupCanvas(config);
    }
    
    // Bind methods to maintain context
    this.gameLoop = this.gameLoop.bind(this);
    
    // Performance metrics
    this.fpsMetrics = {
      current: 0,
      history: [],
      average: 0
    };
  }

  /**
   * Sets up the canvas and rendering context
   * @private
   * @param {Object} config - Engine configuration
   * @throws {Error} If canvas element cannot be found or context cannot be obtained
   */
  setupCanvas(config) {
    if (config.canvasId) {
      this.canvas = document.getElementById(config.canvasId);
      if (!this.canvas) {
        throw new Error(`Canvas element with id '${config.canvasId}' not found`);
      }
    } else {
      // Create a new canvas if no ID provided
      this.canvas = document.createElement('canvas');
    }

    if (config.width && config.height) {
      this.canvas.width = config.width;
      this.canvas.height = config.height;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
  }

  /**
   * Initializes the game engine and all registered systems
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      this.lastFrameTime = performance.now();
      
      // Initialize all registered systems
      for (const [name, system] of this.systems) {
        if (typeof system.initialize === 'function') {
          await system.initialize();
        }
      }
      
      if (this.debug) {
        console.log('Game engine initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
      throw error;
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
    
    if (this.debug) {
      console.log('Game engine started');
    }
  }

  /**
   * Stops the game engine
   */
  stop() {
    this.isRunning = false;
    if (this.debug) {
      console.log('Game engine stopped');
    }
  }

  /**
   * Main game loop
   * @private
   * @param {number} currentTime - Current timestamp
   */
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time and FPS
    this.deltaTime = currentTime - this.lastFrameTime;
    
    // Update FPS metrics
    this.updateFpsMetrics();

    // Check if it's time for the next frame (frame rate limiting)
    if (this.deltaTime >= this.frameInterval) {
      // Update timing
      this.lastFrameTime = currentTime - (this.deltaTime % this.frameInterval);

      // Clear canvas if available
      if (this.ctx) {
        this.clear();
      }

      // Update and render
      this.update(this.deltaTime / 1000); // Convert to seconds
      this.render();
      
      this.frameCount++;
    }

    // Schedule next frame
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Updates all game systems, entities, and game objects
   * @param {number} deltaTime - Time elapsed since last update in seconds
   */
  update(deltaTime) {
    try {
      // Update all registered systems first
      for (const system of this.systems.values()) {
        if (typeof system.update === 'function') {
          system.update(deltaTime);
        }
      }

      // Update all entities
      for (const entity of this.entities) {
        if (typeof entity.update === 'function') {
          entity.update(deltaTime);
        }
      }

      // Update legacy game objects for backward compatibility
      for (const gameObject of this.gameObjects) {
        if (typeof gameObject.update === 'function') {
          gameObject.update(deltaTime);
        }
      }
    } catch (error) {
      console.error('Error during update cycle:', error);
      this.handleError(error);
    }
  }

  /**
   * Renders the current game state
   */
  render() {
    try {
      // Render all systems that have render methods
      for (const system of this.systems.values()) {
        if (typeof system.render === 'function') {
          system.render();
        }
      }

      // Render legacy game objects for backward compatibility
      if (this.ctx) {
        for (const gameObject of this.gameObjects) {
          if (typeof gameObject.render === 'function') {
            gameObject.render(this.ctx);
          }
        }
      }
    } catch (error) {
      console.error('Error during render cycle:', error);
      this.handleError(error);
    }
  }

  /**
   * Clears the canvas
   */
  clear() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Registers a new game system
   * @param {string} name - System identifier
   * @param {Object} system - System instance
   */
  registerSystem(name, system) {
    if (!name || !system) {
      throw new Error('Invalid system registration parameters');
    }
    this.systems.set(name, system);
  }

  /**
   * Adds a game object to the engine (legacy support)
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
   * Removes a game object from the engine (legacy support)
   * @param {Object} gameObject - Game object to remove
   */
  removeGameObject(gameObject) {
    this.gameObjects.delete(gameObject);
  }

  /**
   * Adds an entity to the game world
   * @param {Object} entity - Entity instance
   */
  addEntity(entity) {
    if (!entity) {
      throw new Error('Cannot add null entity');
    }
    this.entities.add(entity);
  }

  /**
   * Removes an entity from the game world
   * @param {Object} entity - Entity instance
   */
  removeEntity(entity) {
    this.entities.delete(entity);
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
    if (!this.canvas) return { width: 0, height: 0 };
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  /**
   * Updates FPS metrics
   * @private
   */
  updateFpsMetrics() {
    const currentFps = 1000 / this.deltaTime; // deltaTime is in milliseconds here
    this.fpsMetrics.current = Math.round(currentFps);
    
    // Keep a rolling average of the last 60 frames
    this.fpsMetrics.history.push(currentFps);
    if (this.fpsMetrics.history.length > 60) {
      this.fpsMetrics.history.shift();
    }
    
    this.fpsMetrics.average = Math.round(
      this.fpsMetrics.history.reduce((a, b) => a + b, 0) / 
      this.fpsMetrics.history.length
    );
  }

  /**
   * Handles engine errors
   * @private
   * @param {Error} error - Error to handle
   */
  handleError(error) {
    if (this.debug) {
      console.error('Game Engine Error:', error);
    }
    
    // In production, we might want to gracefully recover or restart
    if (error.fatal) {
      this.stop();
    }
  }

  /**
   * Gets current engine statistics
   * @returns {Object} Engine statistics
   */
  getStats() {
    return {
      fps: this.fpsMetrics.current,
      averageFps: this.fpsMetrics.average,
      entityCount: this.entities.size,
      gameObjectCount: this.gameObjects.size,
      systemCount: this.systems.size,
      frameCount: this.frameCount,
      isRunning: this.isRunning
    };
  }
}

export default GameEngine;