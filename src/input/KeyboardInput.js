/**
 * @fileoverview Keyboard input handler for Space Invaders game
 * Manages keyboard event listeners and maintains state of pressed keys
 */

/**
 * @typedef {Object} KeyState
 * @property {boolean} pressed - Whether the key is currently pressed
 * @property {number} timestamp - When the key was last pressed/released
 */

class KeyboardInput {
    /**
     * Initialize keyboard input handler
     * @param {Object} [options] - Configuration options
     * @param {boolean} [options.preventDefault=true] - Whether to prevent default key behavior
     * @param {string[]} [options.allowedKeys=[]] - List of allowed key codes
     */
    constructor(options = {}) {
        // Initialize key state tracking
        this.keyStates = new Map();
        
        // Configuration
        this.preventDefault = options.preventDefault ?? true;
        this.allowedKeys = new Set(options.allowedKeys || []);
        
        // Bind methods to maintain correct 'this' context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Active state tracking
        this.isActive = false;
    }

    /**
     * Start listening for keyboard events
     * @returns {void}
     */
    activate() {
        if (this.isActive) return;
        
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        this.isActive = true;
    }

    /**
     * Stop listening for keyboard events
     * @returns {void}
     */
    deactivate() {
        if (!this.isActive) return;
        
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.isActive = false;
        this.keyStates.clear();
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - Keyboard event
     * @private
     */
    handleKeyDown(event) {
        const key = event.code;
        
        // Ignore if not in allowed keys (when specified)
        if (this.allowedKeys.size > 0 && !this.allowedKeys.has(key)) {
            return;
        }

        if (this.preventDefault) {
            event.preventDefault();
        }

        this.keyStates.set(key, {
            pressed: true,
            timestamp: performance.now()
        });
    }

    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - Keyboard event
     * @private
     */
    handleKeyUp(event) {
        const key = event.code;
        
        // Ignore if not in allowed keys (when specified)
        if (this.allowedKeys.size > 0 && !this.allowedKeys.has(key)) {
            return;
        }

        if (this.preventDefault) {
            event.preventDefault();
        }

        this.keyStates.set(key, {
            pressed: false,
            timestamp: performance.now()
        });
    }

    /**
     * Check if a key is currently pressed
     * @param {string} keyCode - The key code to check
     * @returns {boolean} Whether the key is pressed
     */
    isKeyPressed(keyCode) {
        const keyState = this.keyStates.get(keyCode);
        return keyState ? keyState.pressed : false;
    }

    /**
     * Get the timestamp of the last key state change
     * @param {string} keyCode - The key code to check
     * @returns {number|null} Timestamp of last state change or null if never pressed
     */
    getKeyTimestamp(keyCode) {
        const keyState = this.keyStates.get(keyCode);
        return keyState ? keyState.timestamp : null;
    }

    /**
     * Get all currently pressed keys
     * @returns {string[]} Array of pressed key codes
     */
    getPressedKeys() {
        const pressedKeys = [];
        for (const [key, state] of this.keyStates) {
            if (state.pressed) {
                pressedKeys.push(key);
            }
        }
        return pressedKeys;
    }

    /**
     * Reset all key states
     * @returns {void}
     */
    reset() {
        this.keyStates.clear();
    }
}

export default KeyboardInput;