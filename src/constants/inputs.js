/**
 * @fileoverview Input-related constants for keyboard and touch controls
 * Defines key mappings, touch zones, and input states used throughout the game
 */

// Keyboard key codes
export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  SPACE: ' ',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  // WASD alternative controls
  A: 'a',
  D: 'd',
  W: 'w',
  S: 's'
};

// Input action types
export const INPUT_ACTIONS = {
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  FIRE: 'FIRE',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME'
};

// Input states
export const INPUT_STATES = {
  PRESSED: 'PRESSED',
  RELEASED: 'RELEASED',
  HELD: 'HELD'
};

// Touch control zones (in percentage of screen width/height)
export const TOUCH_ZONES = {
  LEFT: {
    x: 0,
    y: 50,
    width: 33,
    height: 50
  },
  RIGHT: {
    x: 67,
    y: 50,
    width: 33,
    height: 50
  },
  FIRE: {
    x: 33,
    y: 50,
    width: 34,
    height: 50
  }
};

// Input device types
export const INPUT_DEVICES = {
  KEYBOARD: 'KEYBOARD',
  TOUCH: 'TOUCH'
};

// Key mapping configuration
export const KEY_MAPPINGS = {
  [KEYS.LEFT]: INPUT_ACTIONS.MOVE_LEFT,
  [KEYS.A]: INPUT_ACTIONS.MOVE_LEFT,
  [KEYS.RIGHT]: INPUT_ACTIONS.MOVE_RIGHT,
  [KEYS.D]: INPUT_ACTIONS.MOVE_RIGHT,
  [KEYS.SPACE]: INPUT_ACTIONS.FIRE,
  [KEYS.ESCAPE]: INPUT_ACTIONS.PAUSE
};

// Touch event types
export const TOUCH_EVENTS = {
  START: 'touchstart',
  MOVE: 'touchmove',
  END: 'touchend',
  CANCEL: 'touchcancel'
};

// Input configuration
export const INPUT_CONFIG = {
  // Time in ms to consider a touch as a tap
  TAP_THRESHOLD: 200,
  // Distance in pixels to consider a touch as a swipe
  SWIPE_THRESHOLD: 50,
  // Minimum distance between multi-touch points
  MULTI_TOUCH_THRESHOLD: 30,
  // Maximum time between double tap (ms)
  DOUBLE_TAP_DELAY: 300
};

// Input priority (higher number = higher priority)
export const INPUT_PRIORITY = {
  KEYBOARD: 2,
  TOUCH: 1
};

/**
 * Validates if a key code is a valid game input
 * @param {string} keyCode - The key code to validate
 * @returns {boolean} True if the key code is valid
 */
export const isValidGameKey = (keyCode) => {
  return Object.values(KEYS).includes(keyCode);
};

/**
 * Validates if an action is a valid game action
 * @param {string} action - The action to validate
 * @returns {boolean} True if the action is valid
 */
export const isValidGameAction = (action) => {
  return Object.values(INPUT_ACTIONS).includes(action);
};