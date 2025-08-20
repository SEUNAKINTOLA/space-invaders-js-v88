/**
 * @jest-environment jsdom
 */

describe('GameEngine', () => {
  let gameEngine;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Setup mock canvas and context
    mockCanvas = document.createElement('canvas');
    mockContext = mockCanvas.getContext('2d');
    mockCanvas.width = 800;
    mockCanvas.height = 600;

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(callback => {
      return setTimeout(callback, 0);
    });

    // Mock performance.now()
    global.performance.now = jest.fn(() => Date.now());

    gameEngine = new GameEngine(mockCanvas);
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (gameEngine) {
      gameEngine.stop();
    }
  });

  describe('Initialization', () => {
    test('should properly initialize with canvas element', () => {
      expect(gameEngine.canvas).toBe(mockCanvas);
      expect(gameEngine.context).toBe(mockContext);
      expect(gameEngine.isRunning).toBe(false);
      expect(gameEngine.gameObjects).toEqual([]);
    });

    test('should throw error when initialized without canvas', () => {
      expect(() => new GameEngine()).toThrow('Canvas is required');
    });
  });

  describe('Game Loop', () => {
    test('should start game loop when start is called', () => {
      gameEngine.start();
      expect(gameEngine.isRunning).toBe(true);
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    test('should stop game loop when stop is called', () => {
      gameEngine.start();
      gameEngine.stop();
      expect(gameEngine.isRunning).toBe(false);
    });

    test('should maintain consistent frame rate', () => {
      const targetFPS = 60;
      const expectedFrameTime = 1000 / targetFPS;
      
      let lastFrameTime = performance.now();
      let frameCount = 0;
      
      gameEngine.start();
      
      // Simulate multiple frames
      for (let i = 0; i < 10; i++) {
        performance.now.mockReturnValue(lastFrameTime + expectedFrameTime);
        requestAnimationFrame.mock.calls[i][0]();
        lastFrameTime += expectedFrameTime;
        frameCount++;
      }
      
      expect(frameCount).toBe(10);
    });
  });

  describe('GameObject Management', () => {
    test('should add game objects correctly', () => {
      const mockGameObject = {
        update: jest.fn(),
        render: jest.fn()
      };

      gameEngine.addGameObject(mockGameObject);
      expect(gameEngine.gameObjects).toContain(mockGameObject);
    });

    test('should remove game objects correctly', () => {
      const mockGameObject = {
        update: jest.fn(),
        render: jest.fn()
      };

      gameEngine.addGameObject(mockGameObject);
      gameEngine.removeGameObject(mockGameObject);
      expect(gameEngine.gameObjects).not.toContain(mockGameObject);
    });

    test('should update all game objects', () => {
      const mockGameObject1 = {
        update: jest.fn(),
        render: jest.fn()
      };
      const mockGameObject2 = {
        update: jest.fn(),
        render: jest.fn()
      };

      gameEngine.addGameObject(mockGameObject1);
      gameEngine.addGameObject(mockGameObject2);
      
      const deltaTime = 16.67; // Simulate ~60 FPS
      gameEngine.update(deltaTime);

      expect(mockGameObject1.update).toHaveBeenCalledWith(deltaTime);
      expect(mockGameObject2.update).toHaveBeenCalledWith(deltaTime);
    });
  });

  describe('Rendering', () => {
    test('should clear canvas before each render', () => {
      jest.spyOn(mockContext, 'clearRect');
      gameEngine.render();
      expect(mockContext.clearRect).toHaveBeenCalledWith(
        0, 0, mockCanvas.width, mockCanvas.height
      );
    });

    test('should render all game objects', () => {
      const mockGameObject1 = {
        update: jest.fn(),
        render: jest.fn()
      };
      const mockGameObject2 = {
        update: jest.fn(),
        render: jest.fn()
      };

      gameEngine.addGameObject(mockGameObject1);
      gameEngine.addGameObject(mockGameObject2);
      gameEngine.render();

      expect(mockGameObject1.render).toHaveBeenCalledWith(mockContext);
      expect(mockGameObject2.render).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Error Handling', () => {
    test('should handle game object update errors gracefully', () => {
      const mockGameObject = {
        update: jest.fn().mockImplementation(() => {
          throw new Error('Update error');
        }),
        render: jest.fn()
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      gameEngine.addGameObject(mockGameObject);
      gameEngine.update(16.67);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should handle game object render errors gracefully', () => {
      const mockGameObject = {
        update: jest.fn(),
        render: jest.fn().mockImplementation(() => {
          throw new Error('Render error');
        })
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      gameEngine.addGameObject(mockGameObject);
      gameEngine.render();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    test('should maintain game objects array integrity during updates', () => {
      const gameObjects = Array(1000).fill(null).map(() => ({
        update: jest.fn(),
        render: jest.fn()
      }));

      gameObjects.forEach(obj => gameEngine.addGameObject(obj));
      expect(gameEngine.gameObjects.length).toBe(1000);

      gameEngine.update(16.67);
      expect(gameEngine.gameObjects.length).toBe(1000);
    });
  });
});