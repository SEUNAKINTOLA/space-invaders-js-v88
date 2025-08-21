/**
 * @fileoverview Wave Manager System for Space Invaders
 * Handles enemy wave spawning, patterns, and management
 */

class WaveManager {
    /**
     * @typedef {Object} WaveConfig
     * @property {number} enemyCount - Number of enemies in the wave
     * @property {string} pattern - Movement pattern identifier
     * @property {number} speed - Base movement speed
     * @property {number} spacing - Space between enemies
     */

    /**
     * Initialize the wave manager
     * @param {Object} config - Configuration object
     * @param {number} config.initialWave - Starting wave number
     * @param {number} config.difficultyScale - Scaling factor for difficulty
     */
    constructor(config = {}) {
        this.currentWave = config.initialWave || 1;
        this.difficultyScale = config.difficultyScale || 1.2;
        this.activeEnemies = new Set();
        this.waveInProgress = false;
        this.wavePatterns = this.initializeWavePatterns();
    }

    /**
     * Initialize predefined wave patterns
     * @private
     * @returns {Object} Wave patterns configuration
     */
    initializeWavePatterns() {
        return {
            standard: {
                enemyCount: 10,
                pattern: 'horizontal',
                speed: 1,
                spacing: 50
            },
            aggressive: {
                enemyCount: 8,
                pattern: 'zigzag',
                speed: 1.5,
                spacing: 40
            },
            defensive: {
                enemyCount: 12,
                pattern: 'circular',
                speed: 0.8,
                spacing: 60
            }
        };
    }

    /**
     * Start a new wave
     * @returns {Promise<boolean>} Success status
     */
    async startWave() {
        if (this.waveInProgress) {
            return false;
        }

        try {
            this.waveInProgress = true;
            const waveConfig = this.generateWaveConfig();
            await this.spawnEnemies(waveConfig);
            return true;
        } catch (error) {
            console.error('Error starting wave:', error);
            return false;
        }
    }

    /**
     * Generate configuration for current wave
     * @private
     * @returns {WaveConfig} Wave configuration
     */
    generateWaveConfig() {
        const basePattern = this.getWavePattern();
        return {
            enemyCount: Math.floor(basePattern.enemyCount * Math.pow(this.difficultyScale, this.currentWave - 1)),
            pattern: basePattern.pattern,
            speed: basePattern.speed * Math.pow(this.difficultyScale, (this.currentWave - 1) * 0.2),
            spacing: basePattern.spacing
        };
    }

    /**
     * Get wave pattern based on current wave
     * @private
     * @returns {WaveConfig} Selected wave pattern
     */
    getWavePattern() {
        if (this.currentWave % 3 === 0) {
            return this.wavePatterns.aggressive;
        } else if (this.currentWave % 5 === 0) {
            return this.wavePatterns.defensive;
        }
        return this.wavePatterns.standard;
    }

    /**
     * Spawn enemies for the current wave
     * @private
     * @param {WaveConfig} config - Wave configuration
     * @returns {Promise<void>}
     */
    async spawnEnemies(config) {
        const enemies = [];
        for (let i = 0; i < config.enemyCount; i++) {
            const enemy = this.createEnemy(config, i);
            enemies.push(enemy);
            this.activeEnemies.add(enemy);
        }
        return Promise.all(enemies);
    }

    /**
     * Create a single enemy
     * @private
     * @param {WaveConfig} config - Wave configuration
     * @param {number} index - Enemy index
     * @returns {Object} Enemy object
     */
    createEnemy(config, index) {
        return {
            id: `enemy-${this.currentWave}-${index}`,
            position: this.calculateEnemyPosition(config, index),
            pattern: config.pattern,
            speed: config.speed,
            health: this.calculateEnemyHealth()
        };
    }

    /**
     * Calculate enemy starting position
     * @private
     * @param {WaveConfig} config - Wave configuration
     * @param {number} index - Enemy index
     * @returns {Object} Position coordinates
     */
    calculateEnemyPosition(config, index) {
        return {
            x: (index % 5) * config.spacing + 50,
            y: Math.floor(index / 5) * config.spacing + 50
        };
    }

    /**
     * Calculate enemy health based on current wave
     * @private
     * @returns {number} Enemy health points
     */
    calculateEnemyHealth() {
        return Math.ceil(100 * Math.pow(this.difficultyScale, (this.currentWave - 1) * 0.3));
    }

    /**
     * Check if wave is complete
     * @returns {boolean} Wave completion status
     */
    isWaveComplete() {
        return this.waveInProgress && this.activeEnemies.size === 0;
    }

    /**
     * Remove enemy from active enemies
     * @param {string} enemyId - Enemy identifier
     */
    removeEnemy(enemyId) {
        this.activeEnemies.forEach(enemy => {
            if (enemy.id === enemyId) {
                this.activeEnemies.delete(enemy);
            }
        });

        if (this.activeEnemies.size === 0) {
            this.onWaveComplete();
        }
    }

    /**
     * Handle wave completion
     * @private
     */
    onWaveComplete() {
        this.waveInProgress = false;
        this.currentWave++;
    }

    /**
     * Get current wave number
     * @returns {number} Current wave
     */
    getCurrentWave() {
        return this.currentWave;
    }

    /**
     * Get active enemies count
     * @returns {number} Number of active enemies
     */
    getActiveEnemiesCount() {
        return this.activeEnemies.size;
    }

    /**
     * Reset wave manager state
     */
    reset() {
        this.currentWave = 1;
        this.activeEnemies.clear();
        this.waveInProgress = false;
    }
}

export default WaveManager;