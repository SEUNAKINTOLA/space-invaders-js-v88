/**
 * @fileoverview Audio constants for Space Invaders game
 * Contains all audio-related configuration and constants
 */

/**
 * Sound effect types enumeration
 * @enum {string}
 */
export const SOUND_EFFECTS = {
    PLAYER_SHOOT: 'player_shoot',
    PLAYER_HIT: 'player_hit',
    PLAYER_DEATH: 'player_death',
    ENEMY_SHOOT: 'enemy_shoot',
    ENEMY_HIT: 'enemy_hit',
    ENEMY_DEATH: 'enemy_death',
    GAME_OVER: 'game_over',
    LEVEL_UP: 'level_up',
    MENU_SELECT: 'menu_select',
    POWER_UP: 'power_up'
};

/**
 * Audio file paths relative to assets directory
 * @const {Object.<string, string>}
 */
export const AUDIO_PATHS = {
    [SOUND_EFFECTS.PLAYER_SHOOT]: 'sounds/player_shoot.wav',
    [SOUND_EFFECTS.PLAYER_HIT]: 'sounds/player_hit.wav',
    [SOUND_EFFECTS.PLAYER_DEATH]: 'sounds/player_death.wav',
    [SOUND_EFFECTS.ENEMY_SHOOT]: 'sounds/enemy_shoot.wav',
    [SOUND_EFFECTS.ENEMY_HIT]: 'sounds/enemy_hit.wav',
    [SOUND_EFFECTS.ENEMY_DEATH]: 'sounds/enemy_death.wav',
    [SOUND_EFFECTS.GAME_OVER]: 'sounds/game_over.wav',
    [SOUND_EFFECTS.LEVEL_UP]: 'sounds/level_up.wav',
    [SOUND_EFFECTS.MENU_SELECT]: 'sounds/menu_select.wav',
    [SOUND_EFFECTS.POWER_UP]: 'sounds/power_up.wav'
};

/**
 * Default volume settings
 * @const {Object}
 */
export const VOLUME_SETTINGS = {
    MASTER: 1.0,
    MUSIC: 0.7,
    SFX: 0.8,
    MIN: 0.0,
    MAX: 1.0,
    STEP: 0.1
};

/**
 * Audio format settings
 * @const {Object}
 */
export const AUDIO_FORMAT = {
    SUPPORTED_FORMATS: ['wav', 'mp3', 'ogg'],
    DEFAULT_FORMAT: 'wav',
    SAMPLE_RATE: 44100,
    CHANNELS: 2
};

/**
 * Audio pool configuration for sound effect instances
 * @const {Object}
 */
export const AUDIO_POOL_CONFIG = {
    MAX_INSTANCES: 4,
    PRELOAD: true,
    AUTO_RECYCLE: true
};

/**
 * Audio state constants
 * @enum {string}
 */
export const AUDIO_STATES = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    STOPPED: 'stopped',
    LOADING: 'loading',
    ERROR: 'error'
};

/**
 * Audio error messages
 * @const {Object.<string, string>}
 */
export const AUDIO_ERRORS = {
    LOAD_FAILED: 'Failed to load audio file',
    UNSUPPORTED_FORMAT: 'Audio format not supported',
    PLAYBACK_FAILED: 'Audio playback failed',
    INVALID_VOLUME: 'Invalid volume value'
};

/**
 * Audio event types
 * @enum {string}
 */
export const AUDIO_EVENTS = {
    LOADED: 'loaded',
    ENDED: 'ended',
    ERROR: 'error',
    VOLUME_CHANGE: 'volumechange',
    STATE_CHANGE: 'statechange'
};

/**
 * Default fade settings in milliseconds
 * @const {Object}
 */
export const FADE_SETTINGS = {
    FADE_IN: 500,
    FADE_OUT: 500,
    CROSSFADE: 1000
};

// Export all constants as a single object for convenience
export default {
    SOUND_EFFECTS,
    AUDIO_PATHS,
    VOLUME_SETTINGS,
    AUDIO_FORMAT,
    AUDIO_POOL_CONFIG,
    AUDIO_STATES,
    AUDIO_ERRORS,
    AUDIO_EVENTS,
    FADE_SETTINGS
};