/**
 * @fileoverview Constants related to enemy entities and behaviors in Space Invaders
 * @module EnemyConstants
 */

/**
 * Enemy types with their corresponding properties
 * @enum {Object}
 */
export const ENEMY_TYPES = {
    BASIC: {
        id: 'basic',
        points: 10,
        health: 1,
        speed: 1.0,
        size: { width: 32, height: 32 },
        spriteFrame: 0
    },
    SHOOTER: {
        id: 'shooter',
        points: 20,
        health: 2,
        speed: 0.8,
        size: { width: 32, height: 32 },
        spriteFrame: 1,
        fireRate: 2000 // ms between shots
    },
    ELITE: {
        id: 'elite',
        points: 30,
        health: 3,
        speed: 1.2,
        size: { width: 48, height: 48 },
        spriteFrame: 2,
        fireRate: 1500
    }
};

/**
 * Movement pattern identifiers
 * @enum {string}
 */
export const MOVEMENT_PATTERNS = {
    HORIZONTAL: 'horizontal',
    SINE_WAVE: 'sine_wave',
    ZIGZAG: 'zigzag',
    DIVE: 'dive'
};

/**
 * Wave configuration constants
 * @enum {Object}
 */
export const WAVE_CONFIG = {
    INITIAL_WAVE: {
        enemyCount: 8,
        spacing: { x: 64, y: 48 },
        startPosition: { x: 50, y: 50 }
    },
    WAVE_SCALING: {
        enemyIncrement: 2,
        speedMultiplier: 1.1,
        healthMultiplier: 1.2
    }
};

/**
 * Enemy behavior constants
 * @enum {Object}
 */
export const ENEMY_BEHAVIOR = {
    MOVEMENT: {
        baseSpeed: 100, // pixels per second
        descendSpeed: 20,
        horizontalAmplitude: 100,
        verticalAmplitude: 50,
        oscillationPeriod: 2000 // ms for one complete oscillation
    },
    COMBAT: {
        baseFireRate: 1000,
        projectileSpeed: 200,
        accuracy: 0.8,
        aggressionRadius: 300
    }
};

/**
 * Enemy spawn zones define valid areas for enemy placement
 * @enum {Object}
 */
export const SPAWN_ZONES = {
    TOP: {
        minY: 0,
        maxY: 150,
        padding: 50 // minimum distance from screen edges
    },
    FORMATION: {
        rows: 3,
        columns: 8,
        rowSpacing: 60,
        columnSpacing: 80
    }
};

/**
 * Enemy state constants
 * @enum {string}
 */
export const ENEMY_STATES = {
    SPAWNING: 'spawning',
    ACTIVE: 'active',
    ATTACKING: 'attacking',
    DAMAGED: 'damaged',
    DYING: 'dying'
};

/**
 * Animation constants for enemies
 * @enum {Object}
 */
export const ENEMY_ANIMATIONS = {
    SPAWN: {
        duration: 500,
        frames: 4
    },
    ATTACK: {
        duration: 300,
        frames: 2
    },
    DEATH: {
        duration: 400,
        frames: 3
    }
};

/**
 * Difficulty scaling factors
 * @enum {Object}
 */
export const DIFFICULTY_SCALING = {
    EASY: {
        speedMultiplier: 0.8,
        healthMultiplier: 1.0,
        fireRateMultiplier: 0.7
    },
    NORMAL: {
        speedMultiplier: 1.0,
        healthMultiplier: 1.0,
        fireRateMultiplier: 1.0
    },
    HARD: {
        speedMultiplier: 1.2,
        healthMultiplier: 1.5,
        fireRateMultiplier: 1.3
    }
};

/**
 * Collision constants for enemies
 * @enum {Object}
 */
export const ENEMY_COLLISION = {
    HITBOX_PADDING: 2,
    DAMAGE_TYPES: {
        NORMAL: 1,
        CRITICAL: 2
    },
    IMMUNITY_FRAMES: 30 // frames of immunity after taking damage
};