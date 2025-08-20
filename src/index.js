/**
 * Space Invaders JS V88 - Main Entry Point
 * Initializes and coordinates core game systems and components
 * @module src/index
 */

// Core engine imports
import { GameEngine } from './engine/GameEngine.js';
import { InputManager } from './engine/InputManager.js';
import { Canvas } from './engine/Canvas.js';
import { State } from './engine/State.js';

// System managers
import { AudioManager } from './systems/AudioManager.js';
import { ScoreManager } from './systems/ScoreManager.js';
import { WaveManager } from './systems/WaveManager.js';

// UI Components
import { ScoreDisplay } from './ui/ScoreDisplay.js';
import { VolumeControl } from './ui/VolumeControl.js';

// Constants
import { GameConstants } from './constants/GameConstants.js';

class Game {
    /**
     * Initializes the game and all its subsystems
     */
    constructor() {
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.initialize();
    }

    /**
     * Sets up all game systems and components
     * @private
     */
    initialize() {
        try {
            // Initialize core systems
            this.canvas = new Canvas();
            this.state = new State();
            this.inputManager = new InputManager();
            this.gameEngine = new GameEngine();

            // Initialize game managers
            this.audioManager = new AudioManager();
            this.scoreManager = new ScoreManager();
            this.waveManager = new WaveManager();

            // Initialize UI components
            this.scoreDisplay = new ScoreDisplay();
            this.volumeControl = new VolumeControl();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize game state
            this.state.initialize();

        } catch (error) {
            console.error('Failed to initialize game:', error);
            throw new Error('Game initialization failed');
        }
    }

    /**
     * Sets up event listeners for game controls and UI
     * @private
     */
    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Setup input handlers
        this.inputManager.initialize();
    }

    /**
     * Starts the game loop
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));

        // Start game systems
        this.audioManager.start();
        this.waveManager.start();
    }

    /**
     * Main game loop
     * @param {number} currentTime - Current timestamp
     * @private
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        try {
            // Update game state
            this.update(deltaTime);

            // Render frame
            this.render();

            // Schedule next frame
            requestAnimationFrame(this.gameLoop.bind(this));

        } catch (error) {
            console.error('Game loop error:', error);
            this.handleGameError(error);
        }
    }

    /**
     * Updates game logic
     * @param {number} deltaTime - Time elapsed since last frame
     * @private
     */
    update(deltaTime) {
        this.gameEngine.update(deltaTime);
        this.waveManager.update(deltaTime);
        this.scoreManager.update();
    }

    /**
     * Renders the current frame
     * @private
     */
    render() {
        this.canvas.clear();
        this.gameEngine.render(this.canvas.context);
        this.scoreDisplay.render();
    }

    /**
     * Handles window resize events
     * @private
     */
    handleResize() {
        this.canvas.resize();
        this.gameEngine.handleResize();
    }

    /**
     * Handles visibility change events (tab focus/blur)
     * @private
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Pauses the game
     */
    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.audioManager.pause();
        this.state.setPaused(true);
    }

    /**
     * Resumes the game
     */
    resume() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.audioManager.resume();
        this.state.setPaused(false);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Handles critical game errors
     * @param {Error} error - The error that occurred
     * @private
     */
    handleGameError(error) {
        this.isRunning = false;
        this.state.setError(true);
        console.error('Critical game error:', error);
        // Additional error handling (e.g., showing error screen, reporting to analytics)
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.game = new Game();
        window.game.start();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
});

export default Game;