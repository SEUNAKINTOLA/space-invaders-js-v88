/**
 * @fileoverview Game State Management System
 * Handles the core game state, state transitions, and state persistence
 * for the Space Invaders game engine.
 */

/**
 * @enum {string}
 * Defines possible game states
 */
export const GameStates = {
    INIT: 'INIT',
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    HIGH_SCORE: 'HIGH_SCORE'
};

/**
 * Manages game state and provides methods for state manipulation
 */
export class State {
    /**
     * @typedef {Object} StateConfig
     * @property {GameStates} initialState - Initial game state
     * @property {Object} initialData - Initial state data
     */

    /**
     * @param {StateConfig} config - Configuration object for state initialization
     */
    constructor(config = {}) {
        this._currentState = config.initialState || GameStates.INIT;
        this._previousState = null;
        this._stateData = new Map();
        this._stateListeners = new Map();
        this._transitionValidators = new Map();
        
        // Initialize with provided data
        if (config.initialData) {
            this._stateData.set(this._currentState, config.initialData);
        }
    }

    /**
     * Get the current game state
     * @returns {GameStates} Current state
     */
    getCurrentState() {
        return this._currentState;
    }

    /**
     * Get the previous game state
     * @returns {GameStates|null} Previous state or null if no previous state exists
     */
    getPreviousState() {
        return this._previousState;
    }

    /**
     * Get data associated with the current state
     * @returns {Object|undefined} State data
     */
    getCurrentStateData() {
        return this._stateData.get(this._currentState);
    }

    /**
     * Add a state change listener
     * @param {function(GameStates, GameStates, Object): void} listener - Callback function
     * @returns {function(): void} Function to remove the listener
     */
    addStateChangeListener(listener) {
        const id = Symbol('listener');
        this._stateListeners.set(id, listener);
        
        return () => {
            this._stateListeners.delete(id);
        };
    }

    /**
     * Add a state transition validator
     * @param {GameStates} fromState - Starting state
     * @param {GameStates} toState - Target state
     * @param {function(Object): boolean} validator - Validation function
     */
    addTransitionValidator(fromState, toState, validator) {
        const key = `${fromState}->${toState}`;
        this._transitionValidators.set(key, validator);
    }

    /**
     * Transition to a new state
     * @param {GameStates} newState - State to transition to
     * @param {Object} [stateData={}] - Data to associate with the new state
     * @returns {boolean} Success of state transition
     * @throws {Error} If invalid state transition is attempted
     */
    transition(newState, stateData = {}) {
        if (!Object.values(GameStates).includes(newState)) {
            throw new Error(`Invalid state: ${newState}`);
        }

        const validatorKey = `${this._currentState}->${newState}`;
        const validator = this._transitionValidators.get(validatorKey);

        if (validator && !validator(stateData)) {
            return false;
        }

        const oldState = this._currentState;
        this._previousState = oldState;
        this._currentState = newState;
        this._stateData.set(newState, stateData);

        // Notify listeners
        this._stateListeners.forEach(listener => {
            try {
                listener(oldState, newState, stateData);
            } catch (error) {
                console.error('Error in state change listener:', error);
            }
        });

        return true;
    }

    /**
     * Update data for the current state
     * @param {Object} newData - New state data to merge
     */
    updateCurrentStateData(newData) {
        const currentData = this._stateData.get(this._currentState) || {};
        this._stateData.set(this._currentState, {
            ...currentData,
            ...newData
        });
    }

    /**
     * Reset state to initial conditions
     * @param {GameStates} [initialState=GameStates.INIT] - State to reset to
     * @param {Object} [initialData={}] - Initial state data
     */
    reset(initialState = GameStates.INIT, initialData = {}) {
        this._currentState = initialState;
        this._previousState = null;
        this._stateData.clear();
        this._stateData.set(initialState, initialData);
    }

    /**
     * Check if the game is in a specific state
     * @param {GameStates} state - State to check
     * @returns {boolean} True if current state matches
     */
    isInState(state) {
        return this._currentState === state;
    }
}

/**
 * Create a new State instance with default configuration
 * @returns {State} Configured State instance
 */
export function createDefaultState() {
    return new State({
        initialState: GameStates.INIT,
        initialData: {
            score: 0,
            lives: 3,
            level: 1
        }
    });
}