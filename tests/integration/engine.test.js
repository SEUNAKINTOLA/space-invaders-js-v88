/**
 * Integration tests for the Game Engine core functionality
 * Tests canvas initialization, game loop, and core engine features
 */

describe('Game Engine Integration', () => {
  let canvas;
  let engine;
  let mockCtx;

  beforeEach(() => {
    // Setup mock canvas and context
    canvas = document.createElement('canvas');
    mockCtx = {
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      drawImage: jest.fn()
    };
    canvas.getContext = jest.fn(() => mockCtx);
    
    // Initialize engine with mock canvas
    engine = new GameEngine(canvas);
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (engine) {
      engine.stop();
    }
  });

  describe('Engine Initialization', () => {
    test('should initialize with correct canvas dimensions', () => {
      expect(canvas.width).toBe(800); // Default width
      expect(canvas.height).toBe(600); // Default height
      expect(engine.isRunning).toBe(false);
    });

    test('should setup canvas context correctly', () => {
      expect(canvas.getContext).toHaveBeenCalledWith('2d');
      expect(engine.ctx).toBeTruthy();
    });
  });

  describe('Game Loop Integration', () => {
    test('should start and stop game loop', () => {
      const mockUpdate = jest.fn();
      const mockRender = jest.fn();

      engine.onUpdate = mockUpdate;
      engine.onRender = mockRender;

      engine.start();
      expect(engine.isRunning).toBe(true);

      // Allow a few frames to execute
      jest.advanceTimersByTime(100);

      expect(mockUpdate).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalled();

      engine.stop();
      expect(engine.isRunning).toBe(false);
    });

    test('should maintain consistent frame rate', () => {
      const targetFPS = 60;
      const frameTime = 1000 / targetFPS;
      let lastTime = performance.now();
      const timings = [];

      engine.onUpdate = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        timings.push(delta);
        lastTime = currentTime;
      };

      engine.start();
      jest.advanceTimersByTime(1000); // Simulate 1 second
      engine.stop();

      // Calculate average frame time
      const avgFrameTime = timings.reduce((a, b) => a + b, 0) / timings.length;
      expect(avgFrameTime).toBeCloseTo(frameTime, 1);
    });
  });

  describe('Sprite Management', () => {
    test('should add and remove sprites correctly', () => {
      const sprite1 = { update: jest.fn(), render: jest.fn() };
      const sprite2 = { update: jest.fn(), render: jest.fn() };

      engine.addSprite(sprite1);
      engine.addSprite(sprite2);
      expect(engine.sprites.length).toBe(2);

      engine.removeSprite(sprite1);
      expect(engine.sprites.length).toBe(1);
      expect(engine.sprites[0]).toBe(sprite2);
    });

    test('should update and render all sprites', () => {
      const sprite1 = { update: jest.fn(), render: jest.fn() };
      const sprite2 = { update: jest.fn(), render: jest.fn() };

      engine.addSprite(sprite1);
      engine.addSprite(sprite2);

      engine.start();
      jest.advanceTimersByTime(100);
      engine.stop();

      expect(sprite1.update).toHaveBeenCalled();
      expect(sprite1.render).toHaveBeenCalled();
      expect(sprite2.update).toHaveBeenCalled();
      expect(sprite2.render).toHaveBeenCalled();
    });
  });

  describe('Canvas State Management', () => {
    test('should clear canvas between frames', () => {
      engine.start();
      jest.advanceTimersByTime(100);
      engine.stop();

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    test('should handle canvas resize', () => {
      const newWidth = 1024;
      const newHeight = 768;

      engine.resize(newWidth, newHeight);

      expect(canvas.width).toBe(newWidth);
      expect(canvas.height).toBe(newHeight);
    });
  });

  describe('Error Handling', () => {
    test('should handle sprite update errors gracefully', () => {
      const errorSprite = {
        update: jest.fn().mockImplementation(() => {
          throw new Error('Sprite update error');
        }),
        render: jest.fn()
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      engine.addSprite(errorSprite);
      engine.start();
      jest.advanceTimersByTime(100);
      engine.stop();

      expect(consoleSpy).toHaveBeenCalled();
      expect(engine.isRunning).toBe(false);
      
      consoleSpy.mockRestore();
    });

    test('should handle canvas context loss', () => {
      const contextLostEvent = new Event('webglcontextlost');
      canvas.dispatchEvent(contextLostEvent);

      expect(engine.isRunning).toBe(false);
    });
  });
});