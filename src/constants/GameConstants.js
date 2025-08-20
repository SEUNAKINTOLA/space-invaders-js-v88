/**
 * @fileoverview Game constants used throughout the Space Invaders game
 * Contains core game settings, screen dimensions, game states, and other configuration values
 */

// Game States
export const GAME_STATES = {
    LOADING: 'LOADING',
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    HIGH_SCORE: 'HIGH_SCORE'
};

// Screen Settings
export const SCREEN = {
    WIDTH: 800,
    HEIGHT: 600,
    PADDING: 20,
    BACKGROUND_COLOR: '#000000'
};

// Game Loop Settings
export const GAME_LOOP = {
    FPS: 60,
    FRAME_TIME: 1000 / 60, // ms per frame at 60 FPS
    UPDATE_INTERVAL: 16.67, // ms (approximately 60 FPS)
    MAX_FRAME_SKIP: 5
};

// Collision Layers
export const COLLISION_LAYERS = {
    PLAYER: 0b0001,
    ENEMY: 0b0010,
    PLAYER_PROJECTILE: 0b0100,
    ENEMY_PROJECTILE: 0b1000,
    BARRIER: 0b10000
};

// Game Difficulty Settings
export const DIFFICULTY = {
    EASY: {
        ENEMY_SPEED: 1,
        ENEMY_FIRE_RATE: 1000,
        SCORE_MULTIPLIER: 1
    },
    MEDIUM: {
        ENEMY_SPEED: 1.5,
        ENEMY_FIRE_RATE: 750,
        SCORE_MULTIPLIER: 1.5
    },
    HARD: {
        ENEMY_SPEED: 2,
        ENEMY_FIRE_RATE: 500,
        SCORE_MULTIPLIER: 2
    }
};

// Score Settings
export const SCORE = {
    ENEMY_KILL: 100,
    WAVE_CLEAR: 1000,
    PERFECT_WAVE: 2000,
    HIGH_SCORE_LIMIT: 999999
};

// Game Physics
export const PHYSICS = {
    GRAVITY: 0,
    FRICTION: 0,
    MAX_VELOCITY: 1000,
    COLLISION_PRECISION: 2
};

// Debug Settings
export const DEBUG = {
    SHOW_HITBOX: false,
    SHOW_FPS: false,
    LOG_LEVEL: 'ERROR',
    INVINCIBLE: false
};

// Game Events
export const EVENTS = {
    ENEMY_DESTROYED: 'enemyDestroyed',
    PLAYER_HIT: 'playerHit',
    WAVE_COMPLETE: 'waveComplete',
    GAME_OVER: 'gameOver',
    SCORE_UPDATE: 'scoreUpdate',
    POWER_UP_COLLECTED: 'powerUpCollected'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    HIGH_SCORE: 'spaceInvaders.highScore',
    SETTINGS: 'spaceInvaders.settings',
    VOLUME: 'spaceInvaders.volume'
};

// Animation Settings
export const ANIMATION = {
    DEFAULT_FRAME_DURATION: 100,
    EXPLOSION_FRAMES: 8,
    POWER_UP_FRAMES: 4
};

// Game Boundaries
export const BOUNDARIES = {
    MIN_X: 0,
    MAX_X: SCREEN.WIDTH,
    MIN_Y: 0,
    MAX_Y: SCREEN.HEIGHT,
    PLAY_AREA_TOP: 50,
    PLAY_AREA_BOTTOM: SCREEN.HEIGHT - 50
};

// Error Messages
export const ERROR_MESSAGES = {
    INVALID_STATE: 'Invalid game state transition',
    INITIALIZATION_FAILED: 'Game initialization failed',
    ASSET_LOAD_FAILED: 'Failed to load game assets',
    INVALID_CONFIGURATION: 'Invalid game configuration'
};

Object.freeze(GAME_STATES);
Object.freeze(SCREEN);
Object.freeze(GAME_LOOP);
Object.freeze(COLLISION_LAYERS);
Object.freeze(DIFFICULTY);
Object.freeze(SCORE);
Object.freeze(PHYSICS);
Object.freeze(DEBUG);
Object.freeze(EVENTS);
Object.freeze(STORAGE_KEYS);
Object.freeze(ANIMATION);
Object.freeze(BOUNDARIES);
Object.freeze(ERROR_MESSAGES);