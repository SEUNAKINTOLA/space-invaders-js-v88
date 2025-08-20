/**
 * @fileoverview Core game engine implementation providing game loop and state management
 * @module GameEngine
 */

/**
 * Represents the main game engine that handles the game loop, state management,
 * and coordinates all game systems.
 */
class GameEngine {
    /**
     * Creates a new GameEngine instance
     * @param {Object} config - Engine configuration options
     * @param {number} config.fps - Target frames per second (default: 60)
     * @param {boolean} config.debug - Enable debug mode (default: false)
     */
    constructor(config = {}) {
        this.fps = config.fps || 60;
        this.debug = config.debug || false;
        
        // Core engine state
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        
        // Game systems and entities
        this.systems = new Map();
        this.entities = new Set();
        
        // Bound methods to maintain context
        this.gameLoop = this.gameLoop.bind(this);
        
        // Performance metrics
        this.fpsMetrics = {
            current: 0,
            history: [],
            average: 0
        };
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
     * Main game loop that handles updates and rendering
     * @private
     * @param {number} timestamp - Current frame timestamp
     */
    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta time and FPS
        this.deltaTime = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;
        
        // Update FPS metrics
        this.updateFpsMetrics();

        // Update all systems
        this.update();

        // Render frame
        this.render();

        // Schedule next frame
        this.frameCount++;
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Updates all game systems and entities
     * @private
     */
    update() {
        try {
            // Update all registered systems
            for (const system of this.systems.values()) {
                if (typeof system.update === 'function') {
                    system.update(this.deltaTime);
                }
            }

            // Update all entities
            for (const entity of this.entities) {
                if (typeof entity.update === 'function') {
                    entity.update(this.deltaTime);
                }
            }
        } catch (error) {
            console.error('Error during update cycle:', error);
            this.handleError(error);
        }
    }

    /**
     * Renders the current game state
     * @private
     */
    render() {
        try {
            // Render all systems that have render methods
            for (const system of this.systems.values()) {
                if (typeof system.render === 'function') {
                    system.render();
                }
            }
        } catch (error) {
            console.error('Error during render cycle:', error);
            this.handleError(error);
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
     * Updates FPS metrics
     * @private
     */
    updateFpsMetrics() {
        const currentFps = 1 / this.deltaTime;
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
            systemCount: this.systems.size,
            frameCount: this.frameCount,
            isRunning: this.isRunning
        };
    }
}

export default GameEngine;