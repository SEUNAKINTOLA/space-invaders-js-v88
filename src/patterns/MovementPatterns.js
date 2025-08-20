/**
 * @fileoverview Movement patterns for enemy entities in Space Invaders
 * Defines reusable movement patterns that can be applied to enemy ships
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * @typedef {Object} MovementConfig
 * @property {number} speed - Base movement speed
 * @property {number} amplitude - Wave amplitude for oscillating patterns
 * @property {number} frequency - Frequency of oscillation
 * @property {number} boundaryLeft - Left movement boundary
 * @property {number} boundaryRight - Right movement boundary
 */

/**
 * Base movement pattern class
 */
class MovementPattern {
    /**
     * @param {MovementConfig} config - Movement configuration
     */
    constructor(config) {
        this.speed = config.speed || 2;
        this.amplitude = config.amplitude || 30;
        this.frequency = config.frequency || 0.02;
        this.boundaryLeft = config.boundaryLeft || 0;
        this.boundaryRight = config.boundaryRight || 800;
        this.time = 0;
    }

    /**
     * Updates the position based on the pattern
     * @param {Position} currentPos - Current position
     * @param {number} deltaTime - Time since last update
     * @returns {Position} New position
     */
    update(currentPos, deltaTime) {
        // Base class - no movement
        return { ...currentPos };
    }
}

/**
 * Horizontal side-to-side movement pattern
 */
class HorizontalPattern extends MovementPattern {
    constructor(config) {
        super(config);
        this.direction = 1; // 1 for right, -1 for left
    }

    /**
     * @param {Position} currentPos - Current position
     * @param {number} deltaTime - Time since last update
     * @returns {Position} New position
     */
    update(currentPos, deltaTime) {
        let newX = currentPos.x + (this.speed * this.direction * deltaTime);

        // Reverse direction at boundaries
        if (newX >= this.boundaryRight) {
            this.direction = -1;
            newX = this.boundaryRight;
        } else if (newX <= this.boundaryLeft) {
            this.direction = 1;
            newX = this.boundaryLeft;
        }

        return {
            x: newX,
            y: currentPos.y
        };
    }
}

/**
 * Sine wave movement pattern
 */
class SineWavePattern extends MovementPattern {
    /**
     * @param {Position} currentPos - Current position
     * @param {number} deltaTime - Time since last update
     * @returns {Position} New position
     */
    update(currentPos, deltaTime) {
        this.time += deltaTime;
        
        return {
            x: currentPos.x + (this.speed * deltaTime),
            y: currentPos.y + Math.sin(this.time * this.frequency) * this.amplitude
        };
    }
}

/**
 * Dive bombing pattern - moves down in an arc
 */
class DiveBombPattern extends MovementPattern {
    constructor(config) {
        super(config);
        this.initialY = 0;
        this.hasStarted = false;
    }

    /**
     * @param {Position} currentPos - Current position
     * @param {number} deltaTime - Time since last update
     * @returns {Position} New position
     */
    update(currentPos, deltaTime) {
        if (!this.hasStarted) {
            this.initialY = currentPos.y;
            this.hasStarted = true;
        }

        this.time += deltaTime;

        // Parabolic motion
        const verticalSpeed = this.speed * 2;
        const horizontalSpeed = this.speed;

        return {
            x: currentPos.x + (horizontalSpeed * deltaTime),
            y: this.initialY + (verticalSpeed * this.time) + 
               (0.5 * verticalSpeed * this.time * this.time)
        };
    }
}

/**
 * Circular movement pattern
 */
class CircularPattern extends MovementPattern {
    /**
     * @param {Position} currentPos - Current position
     * @param {number} deltaTime - Time since last update
     * @returns {Position} New position
     */
    update(currentPos, deltaTime) {
        this.time += deltaTime;
        
        return {
            x: currentPos.x + Math.cos(this.time * this.frequency) * this.amplitude,
            y: currentPos.y + Math.sin(this.time * this.frequency) * this.amplitude
        };
    }
}

/**
 * Factory for creating movement patterns
 */
class MovementPatternFactory {
    /**
     * Creates a movement pattern instance
     * @param {string} type - Pattern type
     * @param {MovementConfig} config - Movement configuration
     * @returns {MovementPattern} Movement pattern instance
     */
    static create(type, config) {
        switch (type.toLowerCase()) {
            case 'horizontal':
                return new HorizontalPattern(config);
            case 'sine':
                return new SineWavePattern(config);
            case 'dive':
                return new DiveBombPattern(config);
            case 'circular':
                return new CircularPattern(config);
            default:
                return new MovementPattern(config);
        }
    }
}

export {
    MovementPattern,
    HorizontalPattern,
    SineWavePattern,
    DiveBombPattern,
    CircularPattern,
    MovementPatternFactory
};