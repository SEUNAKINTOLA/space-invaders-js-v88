/**
 * @fileoverview Enemy wave configuration for Space Invaders
 * Defines wave patterns, enemy types, movement behaviors, and difficulty scaling
 */

// Wave difficulty multipliers
const DIFFICULTY_SCALING = {
    SPEED: 1.15,      // Speed increase per wave
    HEALTH: 1.2,      // Health increase per wave
    FREQUENCY: 0.9,   // Spawn frequency multiplier (decreases delay)
    MAX_WAVES: 10     // Maximum number of waves before looping with increased difficulty
};

// Enemy types with base stats
const ENEMY_TYPES = {
    BASIC: {
        health: 100,
        speed: 50,
        points: 100,
        shootInterval: 2000,
        sprite: 'basic_enemy'
    },
    FAST: {
        health: 75,
        speed: 100,
        points: 150,
        shootInterval: 1500,
        sprite: 'fast_enemy'
    },
    TANK: {
        health: 200,
        speed: 30,
        points: 200,
        shootInterval: 3000,
        sprite: 'tank_enemy'
    },
    BOSS: {
        health: 1000,
        speed: 40,
        points: 1000,
        shootInterval: 1000,
        sprite: 'boss_enemy'
    }
};

// Movement patterns
const MOVEMENT_PATTERNS = {
    ZIGZAG: {
        type: 'zigzag',
        amplitude: 100,
        frequency: 0.5
    },
    SINE_WAVE: {
        type: 'sine',
        amplitude: 150,
        frequency: 0.3
    },
    LINEAR: {
        type: 'linear',
        direction: 'left-right'
    },
    CIRCULAR: {
        type: 'circular',
        radius: 100,
        speed: 0.2
    }
};

// Formation patterns
const FORMATIONS = {
    V_SHAPE: {
        spacing: { x: 60, y: 40 },
        rows: 3,
        columns: 5,
        pattern: [
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1]
        ]
    },
    GRID: {
        spacing: { x: 50, y: 50 },
        rows: 4,
        columns: 6,
        pattern: null // Uniform grid
    },
    DIAMOND: {
        spacing: { x: 50, y: 50 },
        rows: 4,
        columns: 4,
        pattern: [
            [0, 0, 1, 0],
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [0, 0, 1, 0]
        ]
    }
};

/**
 * Wave definitions array
 * Each wave specifies enemy types, formations, and behaviors
 * @type {Array<Object>}
 */
const WAVES = [
    // Wave 1 - Basic introduction
    {
        id: 1,
        enemies: [
            {
                type: ENEMY_TYPES.BASIC,
                count: 10,
                formation: FORMATIONS.GRID,
                movement: MOVEMENT_PATTERNS.LINEAR
            }
        ],
        spawnDelay: 1000,
        clearDelay: 3000
    },

    // Wave 2 - Mixed basic and fast enemies
    {
        id: 2,
        enemies: [
            {
                type: ENEMY_TYPES.BASIC,
                count: 8,
                formation: FORMATIONS.V_SHAPE,
                movement: MOVEMENT_PATTERNS.ZIGZAG
            },
            {
                type: ENEMY_TYPES.FAST,
                count: 4,
                formation: FORMATIONS.GRID,
                movement: MOVEMENT_PATTERNS.SINE_WAVE
            }
        ],
        spawnDelay: 800,
        clearDelay: 3000
    },

    // Wave 3 - Tank introduction
    {
        id: 3,
        enemies: [
            {
                type: ENEMY_TYPES.TANK,
                count: 3,
                formation: FORMATIONS.DIAMOND,
                movement: MOVEMENT_PATTERNS.LINEAR
            },
            {
                type: ENEMY_TYPES.BASIC,
                count: 6,
                formation: FORMATIONS.GRID,
                movement: MOVEMENT_PATTERNS.ZIGZAG
            }
        ],
        spawnDelay: 1200,
        clearDelay: 4000
    },

    // Boss wave
    {
        id: 4,
        enemies: [
            {
                type: ENEMY_TYPES.BOSS,
                count: 1,
                formation: null, // Single enemy, no formation
                movement: MOVEMENT_PATTERNS.CIRCULAR
            },
            {
                type: ENEMY_TYPES.FAST,
                count: 4,
                formation: FORMATIONS.V_SHAPE,
                movement: MOVEMENT_PATTERNS.SINE_WAVE
            }
        ],
        spawnDelay: 2000,
        clearDelay: 5000,
        isBossWave: true
    }
];

/**
 * Calculate scaled enemy stats based on wave number
 * @param {Object} baseStats - Base enemy statistics
 * @param {number} waveNumber - Current wave number
 * @returns {Object} Scaled enemy statistics
 */
const calculateWaveScaling = (baseStats, waveNumber) => {
    const scaleFactor = Math.floor(waveNumber / DIFFICULTY_SCALING.MAX_WAVES);
    return {
        health: baseStats.health * Math.pow(DIFFICULTY_SCALING.HEALTH, scaleFactor),
        speed: baseStats.speed * Math.pow(DIFFICULTY_SCALING.SPEED, scaleFactor),
        points: baseStats.points * (scaleFactor + 1),
        shootInterval: baseStats.shootInterval * Math.pow(DIFFICULTY_SCALING.FREQUENCY, scaleFactor)
    };
};

/**
 * Get wave configuration for specified wave number
 * @param {number} waveNumber - Wave number to get configuration for
 * @returns {Object} Wave configuration with scaled difficulty
 */
const getWaveConfig = (waveNumber) => {
    const baseWave = WAVES[(waveNumber - 1) % WAVES.length];
    const scaledWave = JSON.parse(JSON.stringify(baseWave)); // Deep clone

    // Scale enemy stats based on wave number
    scaledWave.enemies = scaledWave.enemies.map(enemy => ({
        ...enemy,
        type: {
            ...enemy.type,
            ...calculateWaveScaling(enemy.type, waveNumber)
        }
    }));

    return scaledWave;
};

export {
    WAVES,
    ENEMY_TYPES,
    MOVEMENT_PATTERNS,
    FORMATIONS,
    DIFFICULTY_SCALING,
    getWaveConfig,
    calculateWaveScaling
};