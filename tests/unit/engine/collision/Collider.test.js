/**
 * @jest-environment jsdom
 */

describe('Collider', () => {
  let collider;
  let mockSprite1;
  let mockSprite2;

  beforeEach(() => {
    // Setup mock sprites with basic collision properties
    mockSprite1 = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      getBounds: () => ({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      })
    };

    mockSprite2 = {
      x: 20,
      y: 20,
      width: 10,
      height: 10,
      getBounds: () => ({
        x: 20,
        y: 20,
        width: 10,
        height: 10
      })
    };

    // Create fresh collider instance for each test
    collider = new Collider();
  });

  describe('checkCollision', () => {
    test('should detect collision between overlapping sprites', () => {
      // Arrange
      mockSprite2.x = 5;
      mockSprite2.y = 5;
      
      // Act
      const result = collider.checkCollision(mockSprite1, mockSprite2);
      
      // Assert
      expect(result).toBe(true);
    });

    test('should not detect collision between non-overlapping sprites', () => {
      // Sprites are already positioned apart in setup
      const result = collider.checkCollision(mockSprite1, mockSprite2);
      expect(result).toBe(false);
    });

    test('should handle edge case when sprites touch exactly', () => {
      // Arrange
      mockSprite2.x = 10; // Right edge of sprite1 touches left edge of sprite2
      mockSprite2.y = 0;
      
      // Act
      const result = collider.checkCollision(mockSprite1, mockSprite2);
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getCollisionPoint', () => {
    test('should return collision point when sprites overlap', () => {
      // Arrange
      mockSprite2.x = 5;
      mockSprite2.y = 5;
      
      // Act
      const point = collider.getCollisionPoint(mockSprite1, mockSprite2);
      
      // Assert
      expect(point).toEqual({
        x: 5,
        y: 5
      });
    });

    test('should return null when no collision occurs', () => {
      const point = collider.getCollisionPoint(mockSprite1, mockSprite2);
      expect(point).toBeNull();
    });
  });

  describe('getCollisionDepth', () => {
    test('should calculate correct collision depth for overlapping sprites', () => {
      // Arrange
      mockSprite2.x = 5;
      mockSprite2.y = 5;
      
      // Act
      const depth = collider.getCollisionDepth(mockSprite1, mockSprite2);
      
      // Assert
      expect(depth).toEqual({
        x: 5,
        y: 5
      });
    });

    test('should return zero depth for non-colliding sprites', () => {
      const depth = collider.getCollisionDepth(mockSprite1, mockSprite2);
      expect(depth).toEqual({
        x: 0,
        y: 0
      });
    });
  });

  describe('error handling', () => {
    test('should throw error when checking collision with invalid sprite', () => {
      expect(() => {
        collider.checkCollision(null, mockSprite2);
      }).toThrow('Invalid sprite object');
    });

    test('should throw error when sprite lacks required properties', () => {
      const invalidSprite = { x: 0, y: 0 }; // Missing width and height
      expect(() => {
        collider.checkCollision(invalidSprite, mockSprite2);
      }).toThrow('Sprite missing required properties');
    });
  });

  describe('performance', () => {
    test('should handle multiple collision checks efficiently', () => {
      const sprites = Array.from({ length: 1000 }, (_, i) => ({
        x: i,
        y: i,
        width: 10,
        height: 10,
        getBounds: () => ({
          x: i,
          y: i,
          width: 10,
          height: 10
        })
      }));

      const startTime = performance.now();
      
      sprites.forEach(sprite => {
        collider.checkCollision(sprite, mockSprite1);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });
  });
});