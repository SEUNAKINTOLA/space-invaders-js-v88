/**
 * @jest
 * Enemy movement pattern tests
 */

describe('EnemyPatterns', () => {
  // Setup common test variables
  let mockGameObject;
  let mockConfig;
  
  beforeEach(() => {
    // Reset mocks before each test
    mockGameObject = {
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      update: jest.fn(),
      setPosition: jest.fn()
    };

    mockConfig = {
      screenWidth: 800,
      screenHeight: 600,
      enemySpeed: 2
    };
  });

  describe('Linear Pattern', () => {
    test('should move enemy horizontally with boundary checks', () => {
      const linearPattern = {
        type: 'LINEAR',
        direction: 'horizontal',
        speed: mockConfig.enemySpeed
      };

      // Test movement within bounds
      const result = applyPattern(mockGameObject, linearPattern, mockConfig);
      expect(result.x).toBe(102); // Initial x + speed
      expect(result.y).toBe(100); // Y should remain unchanged

      // Test boundary collision
      mockGameObject.x = mockConfig.screenWidth - mockGameObject.width;
      const boundaryResult = applyPattern(mockGameObject, linearPattern, mockConfig);
      expect(boundaryResult.x).toBeLessThanOrEqual(mockConfig.screenWidth - mockGameObject.width);
    });

    test('should move enemy vertically with boundary checks', () => {
      const linearPattern = {
        type: 'LINEAR',
        direction: 'vertical',
        speed: mockConfig.enemySpeed
      };

      const result = applyPattern(mockGameObject, linearPattern, mockConfig);
      expect(result.x).toBe(100); // X should remain unchanged
      expect(result.y).toBe(102); // Initial y + speed
    });
  });

  describe('Sine Wave Pattern', () => {
    test('should follow sine wave movement pattern', () => {
      const sinePattern = {
        type: 'SINE',
        amplitude: 50,
        frequency: 0.02,
        speed: mockConfig.enemySpeed
      };

      // Test multiple points along sine wave
      const positions = [];
      for (let t = 0; t < 10; t++) {
        const result = applyPattern(mockGameObject, sinePattern, mockConfig, t);
        positions.push({ x: result.x, y: result.y });
      }

      // Verify wave-like motion
      expect(positions[1].y).not.toBe(positions[0].y);
      expect(positions[2].y).not.toBe(positions[1].y);
      expect(Math.abs(positions[0].y - positions[4].y)).toBeGreaterThan(0);
    });
  });

  describe('Circular Pattern', () => {
    test('should move in circular pattern around center point', () => {
      const circularPattern = {
        type: 'CIRCULAR',
        radius: 50,
        speed: 0.05,
        centerX: 400,
        centerY: 300
      };

      const initialPosition = applyPattern(mockGameObject, circularPattern, mockConfig, 0);
      const quarterCircle = applyPattern(mockGameObject, circularPattern, mockConfig, Math.PI/2);
      
      // Verify circular movement
      expect(initialPosition.x).not.toBe(quarterCircle.x);
      expect(initialPosition.y).not.toBe(quarterCircle.y);
      
      // Verify distance from center remains constant (within floating point precision)
      const initialDistance = Math.sqrt(
        Math.pow(initialPosition.x - circularPattern.centerX, 2) +
        Math.pow(initialPosition.y - circularPattern.centerY, 2)
      );
      
      const quarterDistance = Math.sqrt(
        Math.pow(quarterCircle.x - circularPattern.centerX, 2) +
        Math.pow(quarterCircle.y - circularPattern.centerY, 2)
      );

      expect(Math.abs(initialDistance - quarterDistance)).toBeLessThan(0.1);
    });
  });

  describe('Grid Formation Pattern', () => {
    test('should maintain proper grid spacing and alignment', () => {
      const gridPattern = {
        type: 'GRID',
        rows: 3,
        columns: 4,
        spacing: 40,
        offsetX: 100,
        offsetY: 50
      };

      // Test multiple grid positions
      const positions = [];
      for (let row = 0; row < gridPattern.rows; row++) {
        for (let col = 0; col < gridPattern.columns; col++) {
          mockGameObject.gridPosition = { row, col };
          const result = applyPattern(mockGameObject, gridPattern, mockConfig);
          positions.push(result);
        }
      }

      // Verify grid spacing
      expect(positions[1].x - positions[0].x).toBe(gridPattern.spacing);
      expect(positions[4].y - positions[0].y).toBe(gridPattern.spacing);
      
      // Verify grid boundaries
      const gridWidth = (gridPattern.columns - 1) * gridPattern.spacing;
      const gridHeight = (gridPattern.rows - 1) * gridPattern.spacing;
      
      expect(Math.max(...positions.map(p => p.x)) - Math.min(...positions.map(p => p.x)))
        .toBe(gridWidth);
      expect(Math.max(...positions.map(p => p.y)) - Math.min(...positions.map(p => p.y)))
        .toBe(gridHeight);
    });
  });
});

/**
 * Helper function to apply movement patterns
 * @param {Object} gameObject - The enemy game object
 * @param {Object} pattern - The movement pattern configuration
 * @param {Object} config - Game configuration
 * @param {number} [time=0] - Time parameter for time-based patterns
 * @returns {Object} New position {x, y}
 */
function applyPattern(gameObject, pattern, config, time = 0) {
  switch (pattern.type) {
    case 'LINEAR':
      return {
        x: pattern.direction === 'horizontal' 
          ? Math.min(gameObject.x + pattern.speed, config.screenWidth - gameObject.width)
          : gameObject.x,
        y: pattern.direction === 'vertical'
          ? Math.min(gameObject.y + pattern.speed, config.screenHeight - gameObject.height)
          : gameObject.y
      };
    
    case 'SINE':
      return {
        x: gameObject.x + pattern.speed,
        y: gameObject.y + Math.sin(time * pattern.frequency) * pattern.amplitude
      };
    
    case 'CIRCULAR':
      return {
        x: pattern.centerX + pattern.radius * Math.cos(time * pattern.speed),
        y: pattern.centerY + pattern.radius * Math.sin(time * pattern.speed)
      };
    
    case 'GRID':
      return {
        x: pattern.offsetX + (gameObject.gridPosition.col * pattern.spacing),
        y: pattern.offsetY + (gameObject.gridPosition.row * pattern.spacing)
      };
    
    default:
      return { x: gameObject.x, y: gameObject.y };
  }
}