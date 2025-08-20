/**
 * @jest-environment jsdom
 */

describe('Enemy', () => {
  let enemy;
  let mockGameObject;
  
  beforeEach(() => {
    // Mock GameObject dependencies
    mockGameObject = {
      position: { x: 100, y: 100 },
      rotation: 0,
      scale: { x: 1, y: 1 },
      update: jest.fn(),
      destroy: jest.fn()
    };

    // Create fresh enemy instance before each test
    enemy = {
      ...mockGameObject,
      type: 'enemy',
      health: 100,
      speed: 2,
      points: 10,
      pattern: null,
      isActive: true
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with default properties', () => {
      expect(enemy.type).toBe('enemy');
      expect(enemy.health).toBe(100);
      expect(enemy.speed).toBe(2);
      expect(enemy.points).toBe(10);
      expect(enemy.isActive).toBe(true);
      expect(enemy.pattern).toBeNull();
    });

    test('should inherit GameObject properties', () => {
      expect(enemy.position).toEqual({ x: 100, y: 100 });
      expect(enemy.rotation).toBe(0);
      expect(enemy.scale).toEqual({ x: 1, y: 1 });
    });
  });

  describe('Movement', () => {
    test('should update position based on pattern', () => {
      const mockPattern = {
        getNextPosition: jest.fn().mockReturnValue({ x: 150, y: 150 })
      };
      enemy.pattern = mockPattern;
      
      enemy.update(16); // 16ms delta time
      
      expect(mockPattern.getNextPosition).toHaveBeenCalledWith(
        enemy.position,
        enemy.speed,
        16
      );
      expect(enemy.position).toEqual({ x: 150, y: 150 });
    });

    test('should not move if pattern is null', () => {
      const initialPosition = { ...enemy.position };
      
      enemy.update(16);
      
      expect(enemy.position).toEqual(initialPosition);
    });
  });

  describe('Health Management', () => {
    test('should take damage and update health', () => {
      enemy.takeDamage(30);
      
      expect(enemy.health).toBe(70);
      expect(enemy.isActive).toBe(true);
    });

    test('should be destroyed when health reaches 0', () => {
      enemy.takeDamage(100);
      
      expect(enemy.health).toBe(0);
      expect(enemy.isActive).toBe(false);
      expect(enemy.destroy).toHaveBeenCalled();
    });

    test('should not go below 0 health', () => {
      enemy.takeDamage(150);
      
      expect(enemy.health).toBe(0);
    });
  });

  describe('Collision Detection', () => {
    test('should detect collision with projectile', () => {
      const projectile = {
        position: { x: 100, y: 100 },
        radius: 5
      };
      
      const result = enemy.checkCollision(projectile);
      
      expect(result).toBe(true);
    });

    test('should not detect collision when objects are far apart', () => {
      const projectile = {
        position: { x: 500, y: 500 },
        radius: 5
      };
      
      const result = enemy.checkCollision(projectile);
      
      expect(result).toBe(false);
    });
  });

  describe('Pattern Assignment', () => {
    test('should assign new movement pattern', () => {
      const newPattern = {
        getNextPosition: jest.fn()
      };
      
      enemy.setPattern(newPattern);
      
      expect(enemy.pattern).toBe(newPattern);
    });

    test('should clear existing pattern', () => {
      enemy.pattern = { getNextPosition: jest.fn() };
      
      enemy.clearPattern();
      
      expect(enemy.pattern).toBeNull();
    });
  });

  describe('Points System', () => {
    test('should return correct points value when destroyed', () => {
      const points = enemy.getPoints();
      
      expect(points).toBe(10);
    });

    test('should allow points modification', () => {
      enemy.setPoints(20);
      
      expect(enemy.getPoints()).toBe(20);
    });
  });

  describe('Edge Cases', () => {
    test('should handle negative damage values', () => {
      enemy.takeDamage(-50);
      
      expect(enemy.health).toBe(100);
    });

    test('should handle null position in pattern', () => {
      enemy.pattern = {
        getNextPosition: jest.fn().mockReturnValue(null)
      };
      
      const initialPosition = { ...enemy.position };
      enemy.update(16);
      
      expect(enemy.position).toEqual(initialPosition);
    });
  });
});