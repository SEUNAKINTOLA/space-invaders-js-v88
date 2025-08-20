/**
 * @fileoverview Enemy movement pattern definitions and generators
 * Provides reusable movement patterns for enemy entities in Space Invaders
 */

/**
 * @typedef {Object} PatternConfig
 * @property {number} speed - Base movement speed
 * @property {number} amplitude - Movement amplitude (for wave patterns)
 * @property {number} frequency - Movement frequency (for wave patterns)
 * @property {number} width - Game area width
 * @property {number} height - Game area height
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * Movement pattern types
 * @enum {string}
 */
export const PatternType = {
    HORIZONTAL: 'horizontal',
    SINE_WAVE: 'sine_wave',
    DIVE: 'dive',
    ZIGZAG: 'zigzag',
    CIRCULAR: 'circular'
};

/**
 * Creates a horizontal movement pattern
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @returns {Function} Generator function for position updates
 */
export function createHorizontalPattern(config, startPos) {
    let direction = 1;
    let currentX = startPos.x;
    
    return (deltaTime) => {
        currentX += direction * config.speed * deltaTime;
        
        // Reverse direction at boundaries
        if (currentX >= config.width - 30 || currentX <= 0) {
            direction *= -1;
            return {
                x: currentX,
                y: startPos.y + 20, // Step down when reversing
                direction
            };
        }
        
        return {
            x: currentX,
            y: startPos.y,
            direction
        };
    };
}

/**
 * Creates a sine wave movement pattern
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @returns {Function} Generator function for position updates
 */
export function createSineWavePattern(config, startPos) {
    let time = 0;
    
    return (deltaTime) => {
        time += deltaTime;
        
        const x = startPos.x + Math.sin(time * config.frequency) * config.amplitude;
        const y = startPos.y + (config.speed * time);
        
        return { x, y, direction: Math.cos(time * config.frequency) > 0 ? 1 : -1 };
    };
}

/**
 * Creates a diving attack pattern
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @param {Position} targetPos - Target position to dive towards
 * @returns {Function} Generator function for position updates
 */
export function createDivePattern(config, startPos, targetPos) {
    let progress = 0;
    const dx = targetPos.x - startPos.x;
    const dy = targetPos.y - startPos.y;
    
    return (deltaTime) => {
        progress = Math.min(progress + (config.speed * deltaTime), 1);
        
        // Quadratic easing for more natural dive movement
        const easedProgress = progress * (2 - progress);
        
        return {
            x: startPos.x + (dx * easedProgress),
            y: startPos.y + (dy * easedProgress),
            direction: dx > 0 ? 1 : -1
        };
    };
}

/**
 * Creates a zigzag movement pattern
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @returns {Function} Generator function for position updates
 */
export function createZigzagPattern(config, startPos) {
    let direction = 1;
    let currentX = startPos.x;
    let currentY = startPos.y;
    let stepCount = 0;
    
    return (deltaTime) => {
        currentX += direction * config.speed * deltaTime;
        
        // Change direction and move down after specific distance
        if (Math.abs(currentX - startPos.x) >= config.amplitude) {
            direction *= -1;
            currentY += config.frequency;
            stepCount++;
            
            // Reset horizontal position to prevent drift
            currentX = direction > 0 ? startPos.x : startPos.x + config.amplitude;
        }
        
        return {
            x: currentX,
            y: currentY,
            direction
        };
    };
}

/**
 * Creates a circular movement pattern
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @returns {Function} Generator function for position updates
 */
export function createCircularPattern(config, startPos) {
    let angle = 0;
    
    return (deltaTime) => {
        angle += config.speed * deltaTime;
        
        const x = startPos.x + Math.cos(angle) * config.amplitude;
        const y = startPos.y + Math.sin(angle) * config.amplitude;
        
        return {
            x,
            y,
            direction: Math.cos(angle) > 0 ? 1 : -1
        };
    };
}

/**
 * Pattern factory to create movement patterns
 * @param {PatternType} type - Type of pattern to create
 * @param {PatternConfig} config - Pattern configuration
 * @param {Position} startPos - Initial position
 * @param {Position} [targetPos] - Target position (for dive pattern)
 * @returns {Function} Pattern generator function
 */
export function createPattern(type, config, startPos, targetPos) {
    switch (type) {
        case PatternType.HORIZONTAL:
            return createHorizontalPattern(config, startPos);
        case PatternType.SINE_WAVE:
            return createSineWavePattern(config, startPos);
        case PatternType.DIVE:
            if (!targetPos) {
                throw new Error('Target position required for dive pattern');
            }
            return createDivePattern(config, startPos, targetPos);
        case PatternType.ZIGZAG:
            return createZigzagPattern(config, startPos);
        case PatternType.CIRCULAR:
            return createCircularPattern(config, startPos);
        default:
            throw new Error(`Unknown pattern type: ${type}`);
    }
}