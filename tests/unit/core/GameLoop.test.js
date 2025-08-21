/**
 * @jest-environment jsdom
 */

describe('GameLoop', () => {
  let gameLoop;
  let mockRenderer;
  let mockUpdate;
  let requestAnimationFrameSpy;

  beforeEach(() => {
    // Mock requestAnimationFrame
    requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
      .mockImplementation(cb => setTimeout(cb, 0));

    // Setup mock renderer
    mockRenderer = {
      render: jest.fn()
    };

    // Setup mock update function
    mockUpdate = jest.fn();

    // Import and instantiate fresh GameLoop for each test
    const GameLoop = require('../../../src/core/GameLoop').default;
    gameLoop = new GameLoop(mockRenderer, mockUpdate);
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
    requestAnimationFrameSpy.mockRestore();
    
    if (gameLoop.isRunning) {
      gameLoop.stop();
    }
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      expect(gameLoop.isRunning).toBe(false);
      expect(gameLoop.lastTime).toBe(0);
      expect(gameLoop.accumulator).toBe(0);
      expect(gameLoop.renderer).toBe(mockRenderer);
      expect(gameLoop.update).toBe(mockUpdate);
    });

    it('should throw error if renderer is not provided', () => {
      expect(() => new GameLoop(null, mockUpdate))
        .toThrow('Renderer is required');
    });

    it('should throw error if update function is not provided', () => {
      expect(() => new GameLoop(mockRenderer, null))
        .toThrow('Update function is required');
    });
  });

  describe('start', () => {
    it('should start the game loop', () => {
      gameLoop.start();
      expect(gameLoop.isRunning).toBe(true);
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
    });

    it('should not start multiple loops if already running', () => {
      gameLoop.start();
      const firstRequestId = gameLoop.requestId;
      gameLoop.start();
      expect(gameLoop.requestId).toBe(firstRequestId);
    });
  });

  describe('stop', () => {
    it('should stop the game loop', () => {
      gameLoop.start();
      gameLoop.stop();
      expect(gameLoop.isRunning).toBe(false);
    });

    it('should be safe to call stop multiple times', () => {
      gameLoop.start();
      gameLoop.stop();
      expect(() => gameLoop.stop()).not.toThrow();
    });
  });

  describe('gameLoop', () => {
    it('should call update and render with correct delta time', (done) => {
      const FIXED_TIMESTEP = 1000 / 60; // 60 FPS
      
      gameLoop.start();

      // Simulate multiple frames
      setTimeout(() => {
        expect(mockUpdate).toHaveBeenCalled();
        expect(mockRenderer.render).toHaveBeenCalled();
        
        // Verify delta time is being passed
        const updateCall = mockUpdate.mock.calls[0][0];
        expect(typeof updateCall).toBe('number');
        expect(updateCall).toBeLessThanOrEqual(FIXED_TIMESTEP);
        
        done();
      }, FIXED_TIMESTEP * 2);
    });

    it('should maintain constant game speed with variable frame rate', (done) => {
      const FIXED_TIMESTEP = 1000 / 60;
      let updateCount = 0;
      
      mockUpdate.mockImplementation(() => {
        updateCount++;
      });

      gameLoop.start();

      setTimeout(() => {
        const expectedUpdates = Math.floor(FIXED_TIMESTEP * 3 / FIXED_TIMESTEP);
        expect(updateCount).toBeGreaterThanOrEqual(expectedUpdates);
        done();
      }, FIXED_TIMESTEP * 3);
    });
  });

  describe('performance', () => {
    it('should limit accumulated time to prevent spiral of death', () => {
      const MAX_ACCUMULATED_TIME = 200; // ms
      const largeTimestamp = 1000; // Simulate a very long frame
      
      gameLoop.lastTime = 0;
      gameLoop.accumulator = 0;
      
      // Simulate a frame with very large delta time
      gameLoop.tick(largeTimestamp);
      
      expect(gameLoop.accumulator).toBeLessThanOrEqual(MAX_ACCUMULATED_TIME);
    });
  });
});