/**
 * @jest-environment jsdom
 */

// Test file for src/index.js
describe('Game Initialization', () => {
  let originalDocument;
  let mockCanvas;
  let mockContext;
  
  beforeEach(() => {
    // Store original document
    originalDocument = global.document;

    // Mock canvas and context
    mockCanvas = {
      getContext: jest.fn(),
      width: 800,
      height: 600
    };

    mockContext = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      drawImage: jest.fn()
    };

    // Mock document methods and elements
    document.createElement = jest.fn(() => mockCanvas);
    document.getElementById = jest.fn(() => mockCanvas);
    mockCanvas.getContext.mockReturnValue(mockContext);

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(callback => callback());
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
    global.document = originalDocument;
    global.requestAnimationFrame = undefined;
  });

  test('should initialize canvas element', () => {
    // Import and initialize game
    require('../../src/index.js');

    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });

  test('should set up game loop', () => {
    const game = require('../../src/index.js');
    
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('should handle window resize events', () => {
    // Mock window resize event
    const resizeEvent = new Event('resize');
    
    require('../../src/index.js');
    
    window.dispatchEvent(resizeEvent);
    
    // Verify canvas dimensions are updated
    expect(mockCanvas.width).toBeDefined();
    expect(mockCanvas.height).toBeDefined();
  });

  test('should initialize input handlers', () => {
    const game = require('../../src/index.js');
    
    // Simulate keyboard event
    const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(keyEvent);
    
    // Verify event handling
    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  test('should clean up resources on window unload', () => {
    const game = require('../../src/index.js');
    
    // Simulate window unload
    const unloadEvent = new Event('unload');
    window.dispatchEvent(unloadEvent);
    
    // Verify cleanup
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  test('should handle canvas context loss and restore', () => {
    require('../../src/index.js');
    
    // Simulate context loss
    const contextLostEvent = new Event('webglcontextlost');
    mockCanvas.dispatchEvent(contextLostEvent);
    
    // Simulate context restore
    const contextRestoredEvent = new Event('webglcontextrestored');
    mockCanvas.dispatchEvent(contextRestoredEvent);
    
    expect(mockCanvas.getContext).toHaveBeenCalledTimes(2);
  });
});

describe('Error Handling', () => {
  test('should handle canvas creation failure gracefully', () => {
    // Mock document.createElement to return null
    document.createElement = jest.fn(() => null);
    
    // Verify error handling
    expect(() => {
      require('../../src/index.js');
    }).toThrow('Failed to initialize canvas');
  });

  test('should handle context acquisition failure', () => {
    const mockCanvas = {
      getContext: jest.fn(() => null)
    };
    
    document.createElement = jest.fn(() => mockCanvas);
    
    expect(() => {
      require('../../src/index.js');
    }).toThrow('Failed to get canvas context');
  });
});

describe('Performance', () => {
  test('should maintain consistent frame rate', () => {
    jest.useFakeTimers();
    
    const game = require('../../src/index.js');
    
    // Simulate multiple frame updates
    for (let i = 0; i < 60; i++) {
      jest.advanceTimersByTime(16.67); // ~60 FPS
      global.requestAnimationFrame.mock.calls[0][0]();
    }
    
    expect(global.requestAnimationFrame).toHaveBeenCalledTimes(60);
    
    jest.useRealTimers();
  });
});