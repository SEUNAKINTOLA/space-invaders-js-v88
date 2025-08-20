/**
 * @jest-environment jsdom
 */

describe('Sprite', () => {
  let sprite;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Setup mock canvas and context
    mockContext = {
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn()
    };

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      width: 800,
      height: 600
    };

    // Create a new sprite instance before each test
    sprite = new Sprite({
      x: 100,
      y: 200,
      width: 32,
      height: 32,
      image: new Image(),
      rotation: 0,
      scale: 1
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should create a sprite with default values', () => {
      const defaultSprite = new Sprite({});
      
      expect(defaultSprite.x).toBe(0);
      expect(defaultSprite.y).toBe(0);
      expect(defaultSprite.width).toBe(0);
      expect(defaultSprite.height).toBe(0);
      expect(defaultSprite.rotation).toBe(0);
      expect(defaultSprite.scale).toBe(1);
    });

    test('should create a sprite with provided values', () => {
      expect(sprite.x).toBe(100);
      expect(sprite.y).toBe(200);
      expect(sprite.width).toBe(32);
      expect(sprite.height).toBe(32);
      expect(sprite.rotation).toBe(0);
      expect(sprite.scale).toBe(1);
    });
  });

  describe('Position Methods', () => {
    test('setPosition should update x and y coordinates', () => {
      sprite.setPosition(300, 400);
      
      expect(sprite.x).toBe(300);
      expect(sprite.y).toBe(400);
    });

    test('getPosition should return current coordinates', () => {
      const position = sprite.getPosition();
      
      expect(position).toEqual({ x: 100, y: 200 });
    });
  });

  describe('Dimension Methods', () => {
    test('setDimensions should update width and height', () => {
      sprite.setDimensions(64, 64);
      
      expect(sprite.width).toBe(64);
      expect(sprite.height).toBe(64);
    });

    test('getDimensions should return current dimensions', () => {
      const dimensions = sprite.getDimensions();
      
      expect(dimensions).toEqual({ width: 32, height: 32 });
    });
  });

  describe('Transform Methods', () => {
    test('setRotation should update rotation value', () => {
      sprite.setRotation(45);
      
      expect(sprite.rotation).toBe(45);
    });

    test('setScale should update scale value', () => {
      sprite.setScale(2);
      
      expect(sprite.scale).toBe(2);
    });
  });

  describe('Rendering', () => {
    test('draw should apply transformations and draw image', () => {
      sprite.rotation = 45;
      sprite.scale = 2;
      
      sprite.draw(mockContext);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalledWith(100, 200);
      expect(mockContext.rotate).toHaveBeenCalledWith(45 * Math.PI / 180);
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
      expect(mockContext.drawImage).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    test('draw should handle null image gracefully', () => {
      sprite.image = null;
      
      sprite.draw(mockContext);

      expect(mockContext.drawImage).not.toHaveBeenCalled();
    });
  });

  describe('Collision Detection', () => {
    test('getBounds should return correct bounding box', () => {
      const bounds = sprite.getBounds();
      
      expect(bounds).toEqual({
        x: 100,
        y: 200,
        width: 32,
        height: 32
      });
    });

    test('intersects should detect collision with another sprite', () => {
      const otherSprite = new Sprite({
        x: 110,
        y: 210,
        width: 32,
        height: 32
      });

      expect(sprite.intersects(otherSprite)).toBe(true);
    });

    test('intersects should return false when no collision', () => {
      const otherSprite = new Sprite({
        x: 500,
        y: 500,
        width: 32,
        height: 32
      });

      expect(sprite.intersects(otherSprite)).toBe(false);
    });
  });
});