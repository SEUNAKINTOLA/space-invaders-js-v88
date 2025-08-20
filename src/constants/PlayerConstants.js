/**
 * @fileoverview Constants related to player ship configuration and behavior
 * Defines movement speeds, boundaries, shooting mechanics, and visual properties
 */

// Movement constants
export const PLAYER_MOVEMENT = {
    SPEED: 5, // Base movement speed in pixels per frame
    MAX_SPEED: 8, // Maximum movement speed
    ACCELERATION: 0.5, // Movement acceleration
    DECELERATION: 0.3, // Movement deceleration when stopping
    BOUNDARY_PADDING: 10 // Padding from screen edges
};

// Shooting mechanics
export const PLAYER_SHOOTING = {
    COOLDOWN: 250, // Milliseconds between shots
    PROJECTILE_SPEED: 7, // Projectile movement speed
    PROJECTILE_WIDTH: 3,
    PROJECTILE_HEIGHT: 15,
    MAX_PROJECTILES: 3, // Maximum concurrent projectiles
    PROJECTILE_COLOR: '#00ff00'
};

// Player ship dimensions
export const PLAYER_DIMENSIONS = {
    WIDTH: 40,
    HEIGHT: 30,
    HITBOX_PADDING: 2 // Padding for collision detection
};

// Player visual properties
export const PLAYER_VISUALS = {
    DEFAULT_COLOR: '#ffffff',
    DAMAGED_COLOR: '#ff0000',
    INVINCIBLE_COLOR: '#888888',
    SPRITE_SCALE: 1.0
};

// Player state constants
export const PLAYER_STATES = {
    NORMAL: 'normal',
    DAMAGED: 'damaged',
    INVINCIBLE: 'invincible',
    RESPAWNING: 'respawning'
};

// Player gameplay settings
export const PLAYER_GAMEPLAY = {
    INITIAL_LIVES: 3,
    INVINCIBILITY_DURATION: 2000, // Milliseconds of invincibility after damage
    RESPAWN_DELAY: 1000, // Milliseconds before respawning
    STARTING_POSITION_RATIO: 0.5, // Horizontal position ratio from left (0.5 = center)
    VERTICAL_OFFSET: 50 // Pixels from bottom of screen
};

// Player animation constants
export const PLAYER_ANIMATION = {
    BLINK_INTERVAL: 200, // Milliseconds between blink frames when invincible
    DAMAGE_FLASH_DURATION: 100, // Milliseconds to show damage flash
    SPAWN_ANIMATION_DURATION: 500 // Milliseconds for spawn animation
};

// Player sound effect identifiers
export const PLAYER_SOUND_EFFECTS = {
    SHOOT: 'player_shoot',
    DAMAGE: 'player_damage',
    DEATH: 'player_death',
    POWERUP: 'player_powerup'
};

/**
 * Validation ranges for player configuration
 * Used to ensure valid values when modifying player properties
 */
export const PLAYER_VALIDATION = {
    SPEED: {
        MIN: 1,
        MAX: 15
    },
    LIVES: {
        MIN: 1,
        MAX: 10
    },
    COOLDOWN: {
        MIN: 100,
        MAX: 1000
    }
};

// Debug constants
export const PLAYER_DEBUG = {
    SHOW_HITBOX: false,
    SHOW_MOVEMENT_VECTORS: false,
    INVINCIBLE_MODE: false
};