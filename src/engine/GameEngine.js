/**
 * @fileoverview Core Game Engine implementation for Space Invaders JS V88
 * Handles game loop, state management, and canvas rendering coordination
 */

/**
 * Represents the core game engine that manages the game loop and state
 */
class GameEngine {
  /**
   * Creates a new GameEngine instance
   * @param {Object} config - Engine configuration options
   * @param {number} config.targetFPS - Target frames per second (default: 60)
   * @param {boolean} config.debug - Enable debug mode (default: false)
   */
  constructor(config = {}) {
    // Core engine properties
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.frameCount = 0;
    
    // Configuration
    this.targetFPS = config.targetFPS || 60;
    this.frameInterval = 1000 / this.targetFPS;
    this.debug = config.debug || false;

    // Game state
    this.entities = new Set();
    this.systems = new Map();
    
    // Bind methods to preserve context
    this.gameLoop = this.gameLoop.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Initializes the game engine
   * @param {HTMLCanvasElement} canvas - The canvas element to render to
   * @returns {Promise<void>}
   */
  async initialize(canvas) {
    if (!canvas) {
      throw new Error('Canvas element is required for engine initialization');
    }

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    if (!this.context) {
      throw new Error('Failed to get 2D rendering context');
    }

    // Initialize core systems
    try {
      await this.initializeSystems();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
      throw error;
    }
  }

  /**
   * Initializes core game systems
   * @private
   * @returns {Promise<void>}
   */
  async initializeSystems() {
    // Initialize core systems here
    // This will be expanded as other systems are implemented
  }

  /**
   * Starts the game loop
   */
  start() {
    if (!this.isInitialized) {
      throw new Error('Engine must be initialized before starting');
    }

    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Stops the game loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Main game loop
   * @private
   * @param {number} timestamp - Current timestamp from requestAnimationFrame
   */
  gameLoop(timestamp) {
    if (!this.isRunning) {
      return;
    }

    // Calculate delta time
    this.deltaTime = timestamp - this.lastFrameTime;

    // Check if it's time for the next frame
    if (this.deltaTime >= this.frameInterval) {
      // Update game state
      this.update(this.deltaTime);
      
      // Render frame
      this.render();

      // Update timing
      this.lastFrameTime = timestamp - (this.deltaTime % this.frameInterval);
      this.frameCount++;
    }

    // Schedule next frame
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Updates game state
   * @private
   * @param {number} deltaTime - Time elapsed since last update
   */
  update(deltaTime) {
    // Update all game systems
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
  }

  /**
   * Renders the current frame
   * @private
   */
  render() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render all entities
    for (const entity of this.entities) {
      if (typeof entity.render === 'function') {
        entity.render(this.context);
      }
    }

    // Debug rendering
    if (this.debug) {
      this.renderDebugInfo();
    }
  }

  /**
   * Adds an entity to the game
   * @param {Object} entity - Entity to add
   */
  addEntity(entity) {
    if (!entity) {
      throw new Error('Cannot add null or undefined entity');
    }
    this.entities.add(entity);
  }

  /**
   * Removes an entity from the game
   * @param {Object} entity - Entity to remove
   */
  removeEntity(entity) {
    this.entities.delete(entity);
  }

  /**
   * Registers a game system
   * @param {string} name - System name
   * @param {Object} system - System instance
   */
  registerSystem(name, system) {
    if (!name || !system) {
      throw new Error('System name and instance are required');
    }
    this.systems.set(name, system);
  }

  /**
   * Renders debug information
   * @private
   */
  renderDebugInfo() {
    const fps = Math.round(1000 / this.deltaTime);
    const entityCount = this.entities.size;

    this.context.fillStyle = 'white';
    this.context.font = '12px monospace';
    this.context.fillText(`FPS: ${fps}`, 10, 20);
    this.context.fillText(`Entities: ${entityCount}`, 10, 40);
  }

  /**
   * Cleans up engine resources
   */
  cleanup() {
    this.stop();
    this.entities.clear();
    this.systems.clear();
    this.isInitialized = false;
  }
}

export default GameEngine;