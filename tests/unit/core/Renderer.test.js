/**
 * @jest/environment jsdom
 */

describe('Renderer', () => {
  let renderer;
  let canvas;
  let ctx;
  
  beforeEach(() => {
    // Setup canvas and context mocks
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    
    // Mock canvas methods
    ctx.clearRect = jest.fn();
    ctx.drawImage = jest.fn();
    ctx.fillRect = jest.fn();
    
    // Initialize renderer with mocked canvas
    renderer = new Renderer(canvas);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('should create renderer with canvas element', () => {
      expect(renderer.canvas).toBe(canvas);
      expect(renderer.ctx).toBe(ctx);
    });

    test('should throw error if canvas is not provided', () => {
      expect(() => new Renderer()).toThrow('Canvas is required');
    });
  });

  describe('clear()', () => {
    test('should clear entire canvas', () => {
      renderer.clear();
      
      expect(ctx.clearRect).toHaveBeenCalledWith(
        0,
        0,
        canvas.width,
        canvas.height
      );
    });
  });

  describe('drawSprite()', () => {
    let mockSprite;

    beforeEach(() => {
      mockSprite = {
        image: new Image(),
        x: 100,
        y: 200,
        width: 32,
        height: 32
      };
    });

    test('should draw sprite at correct position', () => {
      renderer.drawSprite(mockSprite);

      expect(ctx.drawImage).toHaveBeenCalledWith(
        mockSprite.image,
        mockSprite.x,
        mockSprite.y,
        mockSprite.width,
        mockSprite.height
      );
    });

    test('should throw error if sprite is invalid', () => {
      expect(() => renderer.drawSprite(null)).toThrow('Invalid sprite');
      expect(() => renderer.drawSprite({})).toThrow('Invalid sprite');
    });
  });

  describe('drawRect()', () => {
    test('should draw rectangle with correct dimensions', () => {
      const rect = {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        color: '#FF0000'
      };

      renderer.drawRect(rect);

      expect(ctx.fillStyle).toBe(rect.color);
      expect(ctx.fillRect).toHaveBeenCalledWith(
        rect.x,
        rect.y,
        rect.width,
        rect.height
      );
    });

    test('should throw error if rectangle params are invalid', () => {
      expect(() => renderer.drawRect(null)).toThrow('Invalid rectangle parameters');
      expect(() => renderer.drawRect({})).toThrow('Invalid rectangle parameters');
    });
  });

  describe('render()', () => {
    test('should clear canvas and render game objects', () => {
      const gameObjects = [
        {
          type: 'sprite',
          sprite: {
            image: new Image(),
            x: 0,
            y: 0,
            width: 32,
            height: 32
          }
        },
        {
          type: 'rectangle',
          rect: {
            x: 100,
            y: 100,
            width: 50,
            height: 50,
            color: '#00FF00'
          }
        }
      ];

      renderer.render(gameObjects);

      expect(ctx.clearRect).toHaveBeenCalled();
      expect(ctx.drawImage).toHaveBeenCalled();
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    test('should handle empty game objects array', () => {
      renderer.render([]);
      
      expect(ctx.clearRect).toHaveBeenCalled();
      expect(ctx.drawImage).not.toHaveBeenCalled();
      expect(ctx.fillRect).not.toHaveBeenCalled();
    });

    test('should throw error if game objects parameter is invalid', () => {
      expect(() => renderer.render(null)).toThrow('Invalid game objects');
      expect(() => renderer.render('invalid')).toThrow('Invalid game objects');
    });
  });

  describe('resize()', () => {
    test('should update canvas dimensions', () => {
      const width = 800;
      const height = 600;

      renderer.resize(width, height);

      expect(canvas.width).toBe(width);
      expect(canvas.height).toBe(height);
    });

    test('should throw error if dimensions are invalid', () => {
      expect(() => renderer.resize(-1, 100)).toThrow('Invalid dimensions');
      expect(() => renderer.resize(100, -1)).toThrow('Invalid dimensions');
      expect(() => renderer.resize(0, 0)).toThrow('Invalid dimensions');
    });
  });

  describe('performance', () => {
    test('should maintain reasonable performance with many objects', () => {
      const manyObjects = Array(1000).fill().map(() => ({
        type: 'sprite',
        sprite: {
          image: new Image(),
          x: Math.random() * 800,
          y: Math.random() * 600,
          width: 32,
          height: 32
        }
      }));

      const startTime = performance.now();
      renderer.render(manyObjects);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(16); // Targeting 60fps (16ms per frame)
    });
  });
});