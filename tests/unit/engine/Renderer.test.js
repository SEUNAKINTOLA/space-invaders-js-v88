/**
 * @jest-environment jsdom
 */

describe('Renderer', () => {
    let renderer;
    let mockCanvas;
    let mockContext;

    beforeEach(() => {
        // Setup mock canvas and context
        mockCanvas = document.createElement('canvas');
        mockContext = mockCanvas.getContext('2d');
        
        // Mock canvas methods
        mockContext.clearRect = jest.fn();
        mockContext.fillRect = jest.fn();
        mockContext.drawImage = jest.fn();
        mockContext.save = jest.fn();
        mockContext.restore = jest.fn();
        mockContext.translate = jest.fn();
        mockContext.rotate = jest.fn();
        mockContext.scale = jest.fn();

        // Create renderer instance
        renderer = {
            canvas: mockCanvas,
            context: mockContext,
            width: 800,
            height: 600,
            backgroundColor: '#000000'
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should create canvas with correct dimensions', () => {
            expect(mockCanvas.width).toBe(800);
            expect(mockCanvas.height).toBe(600);
        });

        test('should have 2d context', () => {
            expect(mockContext).toBeTruthy();
        });
    });

    describe('clear', () => {
        test('should clear entire canvas', () => {
            renderer.clear();
            expect(mockContext.clearRect).toHaveBeenCalledWith(
                0, 0, renderer.width, renderer.height
            );
        });
    });

    describe('drawSprite', () => {
        test('should draw image with correct parameters', () => {
            const mockSprite = new Image();
            const x = 100;
            const y = 200;
            
            renderer.drawSprite(mockSprite, x, y);
            
            expect(mockContext.drawImage).toHaveBeenCalledWith(
                mockSprite, x, y
            );
        });

        test('should handle sprite with dimensions', () => {
            const mockSprite = new Image();
            const x = 100;
            const y = 200;
            const width = 50;
            const height = 50;
            
            renderer.drawSprite(mockSprite, x, y, width, height);
            
            expect(mockContext.drawImage).toHaveBeenCalledWith(
                mockSprite, x, y, width, height
            );
        });
    });

    describe('transform operations', () => {
        test('should handle translations', () => {
            const x = 100;
            const y = 200;
            
            renderer.translate(x, y);
            
            expect(mockContext.translate).toHaveBeenCalledWith(x, y);
        });

        test('should handle rotation', () => {
            const angle = Math.PI / 2;
            
            renderer.rotate(angle);
            
            expect(mockContext.rotate).toHaveBeenCalledWith(angle);
        });

        test('should handle scaling', () => {
            const scaleX = 2;
            const scaleY = 2;
            
            renderer.scale(scaleX, scaleY);
            
            expect(mockContext.scale).toHaveBeenCalledWith(scaleX, scaleY);
        });

        test('should save and restore context state', () => {
            renderer.save();
            renderer.restore();
            
            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();
        });
    });

    describe('drawing primitives', () => {
        test('should draw rectangles', () => {
            const x = 100;
            const y = 200;
            const width = 50;
            const height = 50;
            const color = '#FF0000';

            renderer.drawRect(x, y, width, height, color);

            expect(mockContext.fillStyle).toBe(color);
            expect(mockContext.fillRect).toHaveBeenCalledWith(
                x, y, width, height
            );
        });
    });

    describe('error handling', () => {
        test('should handle invalid sprite gracefully', () => {
            const invalidSprite = null;
            
            expect(() => {
                renderer.drawSprite(invalidSprite, 0, 0);
            }).not.toThrow();
        });

        test('should handle invalid dimensions gracefully', () => {
            const mockSprite = new Image();
            
            expect(() => {
                renderer.drawSprite(mockSprite, -1, -1, -10, -10);
            }).not.toThrow();
        });
    });

    describe('performance considerations', () => {
        test('should batch multiple draw operations', () => {
            const sprites = Array(100).fill(new Image());
            const positions = sprites.map((_, i) => ({ x: i, y: i }));

            renderer.batchDraw(sprites, positions);

            // Verify context was saved only once for the batch
            expect(mockContext.save).toHaveBeenCalledTimes(1);
            expect(mockContext.restore).toHaveBeenCalledTimes(1);
        });
    });
});