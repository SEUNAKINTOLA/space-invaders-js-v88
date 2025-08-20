/**
 * @fileoverview Score Management System for Space Invaders
 * Handles score tracking, high scores, and score-related events
 */

class ScoreManager {
    /**
     * @typedef {Object} ScoreConfig
     * @property {number} baseEnemyPoints - Base points for destroying an enemy
     * @property {number} bonusMultiplier - Multiplier for bonus points
     * @property {number} comboTimeWindow - Time window in ms for combo scoring
     */

    /**
     * Initialize the score management system
     * @param {ScoreConfig} config - Configuration for scoring system
     */
    constructor(config = {}) {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.lastKillTime = 0;
        this.comboCount = 0;
        
        // Default configuration values
        this.config = {
            baseEnemyPoints: 100,
            bonusMultiplier: 1.5,
            comboTimeWindow: 2000, // 2 seconds
            ...config
        };

        // Bind methods
        this.addScore = this.addScore.bind(this);
        this.resetScore = this.resetScore.bind(this);
        this.updateHighScore = this.updateHighScore.bind(this);

        // Score event callbacks
        this.onScoreUpdateCallbacks = new Set();
        this.onHighScoreUpdateCallbacks = new Set();
    }

    /**
     * Add points to the current score
     * @param {number} points - Base points to add
     * @param {string} type - Type of scoring event
     * @returns {number} - Points actually awarded including bonuses
     */
    addScore(points, type = 'default') {
        let finalPoints = points;
        const currentTime = Date.now();

        // Handle combo system
        if (currentTime - this.lastKillTime < this.config.comboTimeWindow) {
            this.comboCount++;
            finalPoints *= (1 + (this.comboCount * 0.1)); // 10% increase per combo
        } else {
            this.comboCount = 0;
        }

        // Apply type-specific bonuses
        switch (type) {
            case 'enemy':
                finalPoints = this.calculateEnemyPoints(finalPoints);
                break;
            case 'bonus':
                finalPoints *= this.config.bonusMultiplier;
                break;
            default:
                break;
        }

        this.lastKillTime = currentTime;
        this.currentScore += Math.round(finalPoints);
        this.updateHighScore();
        this.notifyScoreUpdate();

        return finalPoints;
    }

    /**
     * Calculate points for destroying an enemy
     * @param {number} basePoints - Base points for the enemy
     * @returns {number} - Final calculated points
     * @private
     */
    calculateEnemyPoints(basePoints) {
        return basePoints * this.config.baseEnemyPoints / 100;
    }

    /**
     * Reset the current score to zero
     */
    resetScore() {
        this.currentScore = 0;
        this.comboCount = 0;
        this.notifyScoreUpdate();
    }

    /**
     * Get the current score
     * @returns {number}
     */
    getCurrentScore() {
        return this.currentScore;
    }

    /**
     * Get the current high score
     * @returns {number}
     */
    getHighScore() {
        return this.highScore;
    }

    /**
     * Update high score if current score is higher
     * @private
     */
    updateHighScore() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            this.notifyHighScoreUpdate();
        }
    }

    /**
     * Save high score to local storage
     * @private
     */
    saveHighScore() {
        try {
            localStorage.setItem('highScore', this.highScore.toString());
        } catch (error) {
            console.warn('Failed to save high score:', error);
        }
    }

    /**
     * Load high score from local storage
     * @returns {number}
     * @private
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem('highScore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            console.warn('Failed to load high score:', error);
            return 0;
        }
    }

    /**
     * Register callback for score updates
     * @param {Function} callback
     */
    onScoreUpdate(callback) {
        this.onScoreUpdateCallbacks.add(callback);
    }

    /**
     * Register callback for high score updates
     * @param {Function} callback
     */
    onHighScoreUpdate(callback) {
        this.onHighScoreUpdateCallbacks.add(callback);
    }

    /**
     * Remove callback for score updates
     * @param {Function} callback
     */
    removeScoreUpdateCallback(callback) {
        this.onScoreUpdateCallbacks.delete(callback);
    }

    /**
     * Remove callback for high score updates
     * @param {Function} callback
     */
    removeHighScoreUpdateCallback(callback) {
        this.onHighScoreUpdateCallbacks.delete(callback);
    }

    /**
     * Notify all registered callbacks about score update
     * @private
     */
    notifyScoreUpdate() {
        this.onScoreUpdateCallbacks.forEach(callback => {
            try {
                callback(this.currentScore);
            } catch (error) {
                console.error('Error in score update callback:', error);
            }
        });
    }

    /**
     * Notify all registered callbacks about high score update
     * @private
     */
    notifyHighScoreUpdate() {
        this.onHighScoreUpdateCallbacks.forEach(callback => {
            try {
                callback(this.highScore);
            } catch (error) {
                console.error('Error in high score update callback:', error);
            }
        });
    }
}

export default ScoreManager;