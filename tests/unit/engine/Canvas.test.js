/**
 * @jest-environment jsdom
 */

describe('Canvas', () => {
  let Canvas;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn()
    };

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      width: 800,
      height: 600
    };

    // Mock document createElement
    document.createElement = jest.fn(() => mockCanvas);

    // Dynamic import to avoid issues with DOM dependencies
    Canvas = require('../../src/engine/Canvas').default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('should create canvas element with correct dimensions', () => {
      const width = 1024;
      const height = 768;
      const canvas = new Canvas(width, height);

      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(canvas.width).toBe(width);
      expect(canvas.height).toBe(height);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    test('should use default dimensions if none provided', () => {
      const canvas = new Canvas();

      expect(canvas.width).toBe(800); // Default width
      expect(canvas.height).toBe(600); // Default height
    });
  });

  describe('canvas operations', () => {
    let canvas;

    beforeEach(() => {
      canvas = new Canvas(800, 600);
    });

    test('should clear canvas correctly', () => {
      canvas.clear();

      expect(mockContext.clearRect).toHaveBeenCalledWith(
        0,
        0,
        canvas.width,
        canvas.height
      );
    });

    test('should handle resize operations', () => {
      const newWidth = 1200;
      const newHeight = 900;

      canvas.resize(newWidth, newHeight);

      expect(canvas.width).toBe(newWidth);
      expect(canvas.height).toBe(newHeight);
    });

    test('should handle scale transformations', () => {
      const scaleX = 2;
      const scaleY = 1.5;

      canvas.setScale(scaleX, scaleY);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.scale).toHaveBeenCalledWith(scaleX, scaleY);
    });

    test('should handle translate operations', () => {
      const x = 100;
      const y = 50;

      canvas.translate(x, y);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalledWith(x, y);
    });

    test('should restore context state', () => {
      canvas.restoreContext();

      expect(mockContext.restore).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    test('should throw error for invalid dimensions', () => {
      expect(() => new Canvas(-100, 600)).toThrow('Invalid canvas dimensions');
      expect(() => new Canvas(800, -100)).toThrow('Invalid canvas dimensions');
      expect(() => new Canvas(0, 0)).toThrow('Invalid canvas dimensions');
    });

    test('should throw error for invalid scale values', () => {
      const canvas = new Canvas(800, 600);
      expect(() => canvas.setScale(-1, 1)).toThrow('Invalid scale values');
      expect(() => canvas.setScale(0, 0)).toThrow('Invalid scale values');
    });
  });

  describe('context management', () => {
    test('should provide access to canvas context', () => {
      const canvas = new Canvas(800, 600);
      const context = canvas.getContext();

      expect(context).toBe(mockContext);
    });

    test('should maintain context state stack correctly', () => {
      const canvas = new Canvas(800, 600);

      canvas.setScale(2, 2);
      canvas.translate(100, 100);
      canvas.restoreContext();

      expect(mockContext.save).toHaveBeenCalledTimes(2);
      expect(mockContext.restore).toHaveBeenCalledTimes(1);
    });
  });

  describe('canvas element management', () => {
    test('should return canvas element', () => {
      const canvas = new Canvas(800, 600);
      const element = canvas.getElement();

      expect(element).toBe(mockCanvas);
    });

    test('should handle canvas element attachment', () => {
      const canvas = new Canvas(800, 600);
      const mockContainer = document.createElement('div');
      
      canvas.attachTo(mockContainer);

      expect(mockContainer.appendChild).toHaveBeenCalledWith(mockCanvas);
    });
  });
});