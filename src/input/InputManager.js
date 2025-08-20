/**
 * @fileoverview Input Manager - Centralizes keyboard and touch input handling
 * Manages input state and provides a unified interface for game controls
 */

// Input states and constants
const INPUT_STATES = {
  PRESSED: 'pressed',
  RELEASED: 'released',
  IDLE: 'idle'
};

/**
 * InputManager class - Handles and coordinates different input methods
 */
class InputManager {
  constructor() {
    // Input state tracking
    this.inputState = new Map();
    this.touchState = new Map();
    
    // Callback storage
    this.inputCallbacks = new Map();
    
    // Active input tracking
    this.activeInputs = new Set();
    this.isEnabled = true;

    // Bind methods to maintain context
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    // Initialize input handlers
    this.initializeInputHandlers();
  }

  /**
   * Initialize event listeners for input handling
   * @private
   */
  initializeInputHandlers() {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Touch events
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('touchcancel', this.handleTouchEnd);
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeyDown(event) {
    if (!this.isEnabled) return;
    
    const key = event.code;
    this.inputState.set(key, INPUT_STATES.PRESSED);
    this.activeInputs.add(key);
    
    // Trigger callbacks if registered
    if (this.inputCallbacks.has(key)) {
      this.inputCallbacks.get(key)(INPUT_STATES.PRESSED);
    }
  }

  /**
   * Handle keyup events
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeyUp(event) {
    if (!this.isEnabled) return;
    
    const key = event.code;
    this.inputState.set(key, INPUT_STATES.RELEASED);
    this.activeInputs.delete(key);
    
    // Trigger callbacks if registered
    if (this.inputCallbacks.has(key)) {
      this.inputCallbacks.get(key)(INPUT_STATES.RELEASED);
    }
  }

  /**
   * Handle touch start events
   * @param {TouchEvent} event - The touch event
   * @private
   */
  handleTouchStart(event) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const touchId = touch.identifier;
    
    this.touchState.set(touchId, {
      x: touch.clientX,
      y: touch.clientY,
      state: INPUT_STATES.PRESSED
    });
  }

  /**
   * Handle touch end events
   * @param {TouchEvent} event - The touch event
   * @private
   */
  handleTouchEnd(event) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
      this.touchState.delete(touch.identifier);
    });
  }

  /**
   * Register a callback for a specific input
   * @param {string} inputKey - The input key to watch
   * @param {Function} callback - The callback to execute
   */
  registerInputCallback(inputKey, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.inputCallbacks.set(inputKey, callback);
  }

  /**
   * Unregister a callback for a specific input
   * @param {string} inputKey - The input key to unwatch
   */
  unregisterInputCallback(inputKey) {
    this.inputCallbacks.delete(inputKey);
  }

  /**
   * Check if an input is currently active
   * @param {string} inputKey - The input key to check
   * @returns {boolean} True if the input is active
   */
  isInputActive(inputKey) {
    return this.inputState.get(inputKey) === INPUT_STATES.PRESSED;
  }

  /**
   * Get the current touch positions
   * @returns {Array<{x: number, y: number, state: string}>} Array of touch positions
   */
  getTouchPositions() {
    return Array.from(this.touchState.values());
  }

  /**
   * Enable input processing
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable input processing
   */
  disable() {
    this.isEnabled = false;
    this.clearInputStates();
  }

  /**
   * Clear all input states
   * @private
   */
  clearInputStates() {
    this.inputState.clear();
    this.touchState.clear();
    this.activeInputs.clear();
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('touchcancel', this.handleTouchEnd);
    
    this.clearInputStates();
    this.inputCallbacks.clear();
  }
}

export default InputManager;