/**
 * @jest-environment jsdom
 */

describe('CollisionSystem', () => {
  let collisionSystem;
  let mockSprite1;
  let mockSprite2;
  
  beforeEach(() => {
    // Setup mock sprites with colliders
    mockSprite1 = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      collider: {
        bounds: {
          x: 0,
          y: 0,
          width: 10,
          height: 10
        },
        type: 'box'
      }
    };

    mockSprite2 = {
      x: 20,
      y: 20, 
      width: 10,
      height: 10,
      collider: {
        bounds: {
          x: 20,
          y: 20,
          width: 10,
          height: 10
        },
        type: 'box'
      }
    };

    collisionSystem = new CollisionSystem();
  });

  describe('initialization', () => {
    test('should create empty collision system', () => {
      expect(collisionSystem.entities).toEqual([]);
      expect(collisionSystem.quadTree).toBeDefined();
    });

    test('should initialize with correct bounds', () => {
      const bounds = {x: 0, y: 0, width: 800, height: 600};
      const customSystem = new CollisionSystem(bounds);
      expect(customSystem.bounds).toEqual(bounds);
    });
  });

  describe('entity management', () => {
    test('should add entity to collision system', () => {
      collisionSystem.addEntity(mockSprite1);
      expect(collisionSystem.entities).toContain(mockSprite1);
    });

    test('should remove entity from collision system', () => {
      collisionSystem.addEntity(mockSprite1);
      collisionSystem.removeEntity(mockSprite1);
      expect(collisionSystem.entities).not.toContain(mockSprite1);
    });

    test('should handle removing non-existent entity', () => {
      expect(() => collisionSystem.removeEntity(mockSprite1)).not.toThrow();
    });
  });

  describe('collision detection', () => {
    test('should detect collision between overlapping sprites', () => {
      const overlappingSprite = {
        x: 5,
        y: 5,
        width: 10,
        height: 10,
        collider: {
          bounds: {
            x: 5,
            y: 5,
            width: 10,
            height: 10
          },
          type: 'box'
        }
      };

      collisionSystem.addEntity(mockSprite1);
      collisionSystem.addEntity(overlappingSprite);
      
      const collisions = collisionSystem.checkCollisions();
      expect(collisions.length).toBe(1);
      expect(collisions[0]).toEqual({
        entity1: mockSprite1,
        entity2: overlappingSprite
      });
    });

    test('should not detect collision between non-overlapping sprites', () => {
      collisionSystem.addEntity(mockSprite1);
      collisionSystem.addEntity(mockSprite2);
      
      const collisions = collisionSystem.checkCollisions();
      expect(collisions.length).toBe(0);
    });

    test('should handle entities without colliders', () => {
      const spriteWithoutCollider = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      };

      collisionSystem.addEntity(spriteWithoutCollider);
      collisionSystem.addEntity(mockSprite1);
      
      const collisions = collisionSystem.checkCollisions();
      expect(collisions.length).toBe(0);
    });
  });

  describe('performance optimization', () => {
    test('should use quadtree for efficient collision checks', () => {
      const mockQuadTreeInsert = jest.spyOn(collisionSystem.quadTree, 'insert');
      
      collisionSystem.addEntity(mockSprite1);
      expect(mockQuadTreeInsert).toHaveBeenCalledWith(mockSprite1);
    });

    test('should clear and rebuild quadtree on update', () => {
      const mockQuadTreeClear = jest.spyOn(collisionSystem.quadTree, 'clear');
      const mockQuadTreeInsert = jest.spyOn(collisionSystem.quadTree, 'insert');

      collisionSystem.addEntity(mockSprite1);
      collisionSystem.addEntity(mockSprite2);
      collisionSystem.update();

      expect(mockQuadTreeClear).toHaveBeenCalled();
      expect(mockQuadTreeInsert).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    test('should handle collision check with empty system', () => {
      expect(() => collisionSystem.checkCollisions()).not.toThrow();
      expect(collisionSystem.checkCollisions()).toEqual([]);
    });

    test('should handle collision check with single entity', () => {
      collisionSystem.addEntity(mockSprite1);
      expect(collisionSystem.checkCollisions()).toEqual([]);
    });

    test('should handle entities at system bounds', () => {
      const boundarySprite = {
        x: 799,
        y: 599,
        width: 10,
        height: 10,
        collider: {
          bounds: {
            x: 799,
            y: 599,
            width: 10,
            height: 10
          },
          type: 'box'
        }
      };

      collisionSystem.addEntity(boundarySprite);
      expect(() => collisionSystem.checkCollisions()).not.toThrow();
    });
  });

  describe('collision response', () => {
    test('should trigger collision callbacks if defined', () => {
      const mockCallback = jest.fn();
      mockSprite1.onCollision = mockCallback;
      
      const overlappingSprite = {
        x: 5,
        y: 5,
        width: 10,
        height: 10,
        collider: {
          bounds: {
            x: 5,
            y: 5,
            width: 10,
            height: 10
          },
          type: 'box'
        }
      };

      collisionSystem.addEntity(mockSprite1);
      collisionSystem.addEntity(overlappingSprite);
      collisionSystem.checkCollisions();

      expect(mockCallback).toHaveBeenCalledWith(overlappingSprite);
    });
  });
});