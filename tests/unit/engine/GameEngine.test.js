// tests/unit/engine/GameEngine.test.js

describe('GameEngine', () => {
  let gameEngine;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn()
    };

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      width: 800,
      height: 600
    };

    // Mock document methods
    global.document = {
      createElement: jest.fn(() => mockCanvas)
    };

    // Initialize game engine
    gameEngine = new GameEngine();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('should create a new GameEngine instance', () => {
      expect(gameEngine).toBeDefined();
      expect(gameEngine).toBeInstanceOf(GameEngine);
    });

    test('should initialize with default properties', () => {
      expect(gameEngine.isRunning).toBeFalsy();
      expect(gameEngine.entities).toEqual([]);
      expect(gameEngine.lastFrameTime).toBe(0);
    });

    test('should create and configure canvas on init', () => {
      gameEngine.init();
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });
  });

  describe('game loop', () => {
    beforeEach(() => {
      gameEngine.init();
    });

    test('should start game loop when start is called', () => {
      const spy = jest.spyOn(window, 'requestAnimationFrame');
      gameEngine.start();
      
      expect(gameEngine.isRunning).toBeTruthy();
      expect(spy).toHaveBeenCalled();
      
      spy.mockRestore();
    });

    test('should stop game loop when stop is called', () => {
      const spy = jest.spyOn(window, 'cancelAnimationFrame');
      gameEngine.start();
      gameEngine.stop();
      
      expect(gameEngine.isRunning).toBeFalsy();
      expect(spy).toHaveBeenCalled();
      
      spy.mockRestore();
    });

    test('should calculate correct delta time', () => {
      const currentTime = 1000;
      const lastFrameTime = 900;
      const expectedDelta = (currentTime - lastFrameTime) / 1000; // Convert to seconds

      gameEngine.lastFrameTime = lastFrameTime;
      gameEngine.gameLoop(currentTime);

      expect(gameEngine.deltaTime).toBeCloseTo(expectedDelta);
    });
  });

  describe('entity management', () => {
    let mockEntity;

    beforeEach(() => {
      mockEntity = {
        update: jest.fn(),
        render: jest.fn()
      };
    });

    test('should add entity to game engine', () => {
      gameEngine.addEntity(mockEntity);
      expect(gameEngine.entities).toContain(mockEntity);
    });

    test('should remove entity from game engine', () => {
      gameEngine.addEntity(mockEntity);
      gameEngine.removeEntity(mockEntity);
      expect(gameEngine.entities).not.toContain(mockEntity);
    });

    test('should update all entities', () => {
      const mockEntity2 = { update: jest.fn(), render: jest.fn() };
      
      gameEngine.addEntity(mockEntity);
      gameEngine.addEntity(mockEntity2);
      
      gameEngine.updateEntities(0.016); // Simulate 16ms frame time
      
      expect(mockEntity.update).toHaveBeenCalledWith(0.016);
      expect(mockEntity2.update).toHaveBeenCalledWith(0.016);
    });

    test('should render all entities', () => {
      const mockEntity2 = { update: jest.fn(), render: jest.fn() };
      
      gameEngine.addEntity(mockEntity);
      gameEngine.addEntity(mockEntity2);
      
      gameEngine.renderEntities();
      
      expect(mockEntity.render).toHaveBeenCalledWith(mockContext);
      expect(mockEntity2.render).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('canvas operations', () => {
    beforeEach(() => {
      gameEngine.init();
    });

    test('should clear canvas before rendering', () => {
      gameEngine.clearCanvas();
      
      expect(mockContext.clearRect).toHaveBeenCalledWith(
        0,
        0,
        mockCanvas.width,
        mockCanvas.height
      );
    });

    test('should save and restore context state during render', () => {
      gameEngine.renderEntities();
      
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    test('should handle entity update errors gracefully', () => {
      const errorEntity = {
        update: jest.fn().mockImplementation(() => {
          throw new Error('Update error');
        }),
        render: jest.fn()
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      gameEngine.addEntity(errorEntity);
      gameEngine.updateEntities(0.016);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should handle entity render errors gracefully', () => {
      const errorEntity = {
        update: jest.fn(),
        render: jest.fn().mockImplementation(() => {
          throw new Error('Render error');
        })
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      gameEngine.addEntity(errorEntity);
      gameEngine.renderEntities();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});