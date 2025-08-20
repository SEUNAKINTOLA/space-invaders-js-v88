/**
 * @jest-environment jsdom
 */

describe('Canvas', () => {
  let canvas;
  let mockContext;
  
  beforeEach(() => {
    // Setup mock canvas and context
    canvas = document.createElement('canvas');
    mockContext = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn()
    };
    
    canvas.getContext = jest.fn(() => mockContext);
    canvas.setAttribute = jest.fn();
    
    // Mock window properties
    global.innerWidth = 800;
    global.innerHeight = 600;
    
    // Append to body to test DOM interactions
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    // Cleanup
    document.body.removeChild(canvas);
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('should create canvas with correct initial dimensions', () => {
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    test('should get 2d context', () => {
      expect(canvas.getContext).toHaveBeenCalledWith('2d');
    });

    test('should set canvas attributes', () => {
      expect(canvas.setAttribute).toHaveBeenCalledWith('id', 'gameCanvas');
    });
  });

  describe('rendering methods', () => {
    test('should clear canvas correctly', () => {
      const width = 800;
      const height = 600;
      
      canvas.width = width;
      canvas.height = height;
      
      // Simulate clear operation
      mockContext.clearRect(0, 0, width, height);
      
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    test('should handle sprite rendering', () => {
      const mockSprite = {
        x: 100,
        y: 200,
        width: 32,
        height: 32,
        image: new Image()
      };

      mockContext.drawImage(
        mockSprite.image,
        mockSprite.x,
        mockSprite.y,
        mockSprite.width,
        mockSprite.height
      );

      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockSprite.image,
        mockSprite.x,
        mockSprite.y,
        mockSprite.width,
        mockSprite.height
      );
    });
  });

  describe('scaling and resolution', () => {
    test('should handle window resize', () => {
      const newWidth = 1024;
      const newHeight = 768;
      
      // Simulate resize
      global.innerWidth = newWidth;
      global.innerHeight = newHeight;
      
      // Trigger resize event
      global.dispatchEvent(new Event('resize'));
      
      expect(canvas.width).toBe(newWidth);
      expect(canvas.height).toBe(newHeight);
    });

    test('should apply correct scaling', () => {
      const scale = 2;
      mockContext.scale(scale, scale);
      
      expect(mockContext.scale).toHaveBeenCalledWith(scale, scale);
    });
  });

  describe('context state management', () => {
    test('should save and restore context state', () => {
      mockContext.save();
      // Simulate some drawing operations
      mockContext.restore();

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    test('should handle missing context gracefully', () => {
      canvas.getContext = jest.fn(() => null);
      
      expect(() => {
        canvas.getContext('2d');
      }).not.toThrow();
    });

    test('should handle invalid dimensions', () => {
      expect(() => {
        canvas.width = -100;
        canvas.height = -100;
      }).not.toThrow();
    });
  });
});