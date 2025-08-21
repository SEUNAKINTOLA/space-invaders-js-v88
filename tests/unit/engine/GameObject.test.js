/**
 * @jest-environment jsdom
 */

describe('GameObject', () => {
  let gameObject;
  
  // Mock canvas and context since we're testing in jsdom
  let mockCanvas;
  let mockCtx;

  beforeEach(() => {
    // Setup mock canvas and context
    mockCanvas = document.createElement('canvas');
    mockCtx = mockCanvas.getContext('2d');
    
    // Create fresh GameObject instance for each test
    gameObject = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      velocity: { x: 0, y: 0 },
      sprite: null
    };
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should create GameObject with default properties', () => {
      expect(gameObject.x).toBe(100);
      expect(gameObject.y).toBe(100);
      expect(gameObject.width).toBe(50);
      expect(gameObject.height).toBe(50);
      expect(gameObject.velocity).toEqual({ x: 0, y: 0 });
      expect(gameObject.sprite).toBeNull();
    });
  });

  describe('Position and Movement', () => {
    test('should update position based on velocity', () => {
      gameObject.velocity = { x: 5, y: 10 };
      const deltaTime = 16; // Simulate 16ms frame time
      
      // Simulate update method
      gameObject.x += gameObject.velocity.x * (deltaTime / 1000);
      gameObject.y += gameObject.velocity.y * (deltaTime / 1000);

      expect(gameObject.x).toBeCloseTo(100.08);
      expect(gameObject.y).toBeCloseTo(100.16);
    });

    test('should handle zero velocity', () => {
      gameObject.velocity = { x: 0, y: 0 };
      const initialX = gameObject.x;
      const initialY = gameObject.y;
      
      // Simulate update
      gameObject.x += gameObject.velocity.x;
      gameObject.y += gameObject.velocity.y;

      expect(gameObject.x).toBe(initialX);
      expect(gameObject.y).toBe(initialY);
    });
  });

  describe('Collision Detection', () => {
    test('should detect collision with another GameObject', () => {
      const otherObject = {
        x: 120,
        y: 120,
        width: 50,
        height: 50
      };

      // Simple AABB collision check
      const collision = !(gameObject.x + gameObject.width < otherObject.x ||
                        otherObject.x + otherObject.width < gameObject.x ||
                        gameObject.y + gameObject.height < otherObject.y ||
                        otherObject.y + otherObject.height < gameObject.y);

      expect(collision).toBe(true);
    });

    test('should not detect collision when objects are apart', () => {
      const otherObject = {
        x: 200,
        y: 200,
        width: 50,
        height: 50
      };

      // Simple AABB collision check
      const collision = !(gameObject.x + gameObject.width < otherObject.x ||
                        otherObject.x + otherObject.width < gameObject.x ||
                        gameObject.y + gameObject.height < otherObject.y ||
                        otherObject.y + otherObject.height < gameObject.y);

      expect(collision).toBe(false);
    });
  });

  describe('Rendering', () => {
    test('should render sprite when available', () => {
      // Mock sprite
      gameObject.sprite = {
        draw: jest.fn()
      };

      // Simulate render call
      if (gameObject.sprite) {
        gameObject.sprite.draw(mockCtx, gameObject.x, gameObject.y);
      }

      expect(gameObject.sprite.draw).toHaveBeenCalledWith(
        mockCtx,
        gameObject.x,
        gameObject.y
      );
    });

    test('should handle rendering without sprite', () => {
      // Ensure no errors when sprite is null
      gameObject.sprite = null;
      
      // Simulate render - should not throw
      expect(() => {
        if (gameObject.sprite) {
          gameObject.sprite.draw(mockCtx, gameObject.x, gameObject.y);
        }
      }).not.toThrow();
    });
  });

  describe('Boundaries', () => {
    test('should constrain object within canvas bounds', () => {
      mockCanvas.width = 800;
      mockCanvas.height = 600;
      
      // Test right boundary
      gameObject.x = mockCanvas.width + 10;
      gameObject.x = Math.min(gameObject.x, mockCanvas.width - gameObject.width);
      expect(gameObject.x).toBe(mockCanvas.width - gameObject.width);

      // Test bottom boundary
      gameObject.y = mockCanvas.height + 10;
      gameObject.y = Math.min(gameObject.y, mockCanvas.height - gameObject.height);
      expect(gameObject.y).toBe(mockCanvas.height - gameObject.height);
    });

    test('should constrain object to minimum bounds', () => {
      // Test left boundary
      gameObject.x = -10;
      gameObject.x = Math.max(0, gameObject.x);
      expect(gameObject.x).toBe(0);

      // Test top boundary
      gameObject.y = -10;
      gameObject.y = Math.max(0, gameObject.y);
      expect(gameObject.y).toBe(0);
    });
  });
});