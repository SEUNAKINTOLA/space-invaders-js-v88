/**
 * @jest-environment jsdom
 */

describe('Sprite Component Tests', () => {
    let mockCanvas;
    let mockContext;
    let Sprite;

    beforeEach(() => {
        // Mock canvas and context
        mockContext = {
            drawImage: jest.fn(),
            scale: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            save: jest.fn(),
            restore: jest.fn()
        };

        mockCanvas = {
            getContext: jest.fn(() => mockContext),
            width: 800,
            height: 600
        };

        // Create a mock Image class since we're in jsdom environment
        global.Image = class {
            constructor() {
                setTimeout(() => {
                    this.onload && this.onload();
                }, 0);
            }
        };

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('Sprite Construction', () => {
        test('should create a sprite with default parameters', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32
            });

            expect(sprite.width).toBe(32);
            expect(sprite.height).toBe(32);
            expect(sprite.x).toBe(0);
            expect(sprite.y).toBe(0);
            expect(sprite.rotation).toBe(0);
            expect(sprite.scale).toBe(1);
        });

        test('should create a sprite with custom parameters', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 64,
                height: 48,
                x: 100,
                y: 200,
                rotation: 45,
                scale: 2
            });

            expect(sprite.width).toBe(64);
            expect(sprite.height).toBe(48);
            expect(sprite.x).toBe(100);
            expect(sprite.y).toBe(200);
            expect(sprite.rotation).toBe(45);
            expect(sprite.scale).toBe(2);
        });
    });

    describe('Sprite Drawing', () => {
        test('should call correct context methods when drawing', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32
            });

            sprite.draw(mockContext);

            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.translate).toHaveBeenCalled();
            expect(mockContext.drawImage).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();
        });

        test('should apply transformations in correct order', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32,
                x: 100,
                y: 100,
                rotation: 90,
                scale: 2
            });

            const executionOrder = [];
            mockContext.save.mockImplementation(() => executionOrder.push('save'));
            mockContext.translate.mockImplementation(() => executionOrder.push('translate'));
            mockContext.rotate.mockImplementation(() => executionOrder.push('rotate'));
            mockContext.scale.mockImplementation(() => executionOrder.push('scale'));
            mockContext.drawImage.mockImplementation(() => executionOrder.push('draw'));
            mockContext.restore.mockImplementation(() => executionOrder.push('restore'));

            sprite.draw(mockContext);

            expect(executionOrder).toEqual([
                'save',
                'translate',
                'rotate',
                'scale',
                'draw',
                'restore'
            ]);
        });
    });

    describe('Sprite Updates', () => {
        test('should update position correctly', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32,
                x: 0,
                y: 0
            });

            sprite.setPosition(100, 200);
            expect(sprite.x).toBe(100);
            expect(sprite.y).toBe(200);
        });

        test('should update rotation correctly', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32
            });

            sprite.setRotation(45);
            expect(sprite.rotation).toBe(45);
        });

        test('should update scale correctly', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32
            });

            sprite.setScale(2);
            expect(sprite.scale).toBe(2);
        });
    });

    describe('Sprite Boundaries', () => {
        test('should calculate bounds correctly', () => {
            const sprite = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32,
                x: 100,
                y: 100
            });

            const bounds = sprite.getBounds();
            expect(bounds).toEqual({
                left: 100,
                right: 132,
                top: 100,
                bottom: 132
            });
        });

        test('should detect collision with another sprite', () => {
            const sprite1 = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32,
                x: 100,
                y: 100
            });

            const sprite2 = new Sprite({
                imagePath: 'test-image.png',
                width: 32,
                height: 32,
                x: 110,
                y: 110
            });

            expect(sprite1.collidesWith(sprite2)).toBe(true);
        });
    });
});