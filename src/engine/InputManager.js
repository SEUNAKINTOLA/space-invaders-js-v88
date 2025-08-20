/**
 * @fileoverview Input Manager module for handling keyboard and mouse input events
 * Implements the Observer pattern for input event handling
 */

/**
 * @enum {string}
 * Input types supported by the input manager
 */
export const InputType = {
    KEYBOARD: 'keyboard',
    MOUSE: 'mouse',
    GAMEPAD: 'gamepad'
};

/**
 * Manages game input handling and event dispatching
 */
export class InputManager {
    /**
     * Initialize the input manager
     */
    constructor() {
        // Map to store active key states
        this.keyStates = new Map();
        
        // Map to store key bindings
        this.keyBindings = new Map();
        
        // Mouse position tracking
        this.mousePosition = { x: 0, y: 0 };
        
        // Registered event listeners
        this.listeners = new Map();
        
        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        
        // Initialize input listeners
        this.initializeListeners();
    }

    /**
     * Initialize DOM event listeners
     * @private
     */
    initializeListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * Register an input event listener
     * @param {string} eventName - Name of the event to listen for
     * @param {Function} callback - Callback function to execute
     * @returns {string} Listener ID for removal
     */
    addEventListener(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Map());
        }
        const listenerId = crypto.randomUUID();
        this.listeners.get(eventName).set(listenerId, callback);
        return listenerId;
    }

    /**
     * Remove an input event listener
     * @param {string} eventName - Name of the event
     * @param {string} listenerId - ID of the listener to remove
     * @returns {boolean} Success status
     */
    removeEventListener(eventName, listenerId) {
        if (!this.listeners.has(eventName)) return false;
        return this.listeners.get(eventName).delete(listenerId);
    }

    /**
     * Handle keydown events
     * @private
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        event.preventDefault();
        this.keyStates.set(event.code, true);
        this.notifyListeners('keydown', {
            code: event.code,
            key: event.key,
            timestamp: Date.now()
        });
    }

    /**
     * Handle keyup events
     * @private
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        event.preventDefault();
        this.keyStates.set(event.code, false);
        this.notifyListeners('keyup', {
            code: event.code,
            key: event.key,
            timestamp: Date.now()
        });
    }

    /**
     * Handle mouse movement
     * @private
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        this.notifyListeners('mousemove', {
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        });
    }

    /**
     * Handle mouse button down
     * @private
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseDown(event) {
        this.notifyListeners('mousedown', {
            button: event.button,
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        });
    }

    /**
     * Handle mouse button up
     * @private
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseUp(event) {
        this.notifyListeners('mouseup', {
            button: event.button,
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        });
    }

    /**
     * Notify all listeners of an event
     * @private
     * @param {string} eventName - Name of the event
     * @param {Object} eventData - Event data to pass to listeners
     */
    notifyListeners(eventName, eventData) {
        if (!this.listeners.has(eventName)) return;
        
        this.listeners.get(eventName).forEach(callback => {
            try {
                callback(eventData);
            } catch (error) {
                console.error(`Error in input listener for ${eventName}:`, error);
            }
        });
    }

    /**
     * Check if a key is currently pressed
     * @param {string} keyCode - Key code to check
     * @returns {boolean} Key pressed state
     */
    isKeyPressed(keyCode) {
        return this.keyStates.get(keyCode) || false;
    }

    /**
     * Get current mouse position
     * @returns {{x: number, y: number}} Mouse coordinates
     */
    getMousePosition() {
        return { ...this.mousePosition };
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        
        this.keyStates.clear();
        this.listeners.clear();
    }
}

// Export singleton instance
export default new InputManager();