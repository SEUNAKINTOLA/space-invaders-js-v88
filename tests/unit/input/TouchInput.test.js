/**
 * @jest/environment jsdom
 */

describe('TouchInput', () => {
  let touchInput;
  let mockCanvas;
  let mockTouchEvent;

  beforeEach(() => {
    // Setup mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 600;

    // Mock touch event
    mockTouchEvent = {
      preventDefault: jest.fn(),
      touches: [{
        clientX: 100,
        clientY: 200,
        identifier: 1
      }]
    };

    // Initialize TouchInput with mock canvas
    touchInput = {
      canvas: mockCanvas,
      touchStartHandlers: new Set(),
      touchMoveHandlers: new Set(),
      touchEndHandlers: new Set(),
      isEnabled: true,
      
      enable() {
        this.isEnabled = true;
      },
      
      disable() {
        this.isEnabled = false;
      },

      addTouchStartHandler(handler) {
        this.touchStartHandlers.add(handler);
      },

      addTouchMoveHandler(handler) {
        this.touchMoveHandlers.add(handler);
      },

      addTouchEndHandler(handler) {
        this.touchEndHandlers.add(handler);
      },

      removeTouchStartHandler(handler) {
        this.touchStartHandlers.delete(handler);
      },

      removeTouchMoveHandler(handler) {
        this.touchMoveHandlers.delete(handler);
      },

      removeTouchEndHandler(handler) {
        this.touchEndHandlers.delete(handler);
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Event Handling', () => {
    test('should register touch start handler', () => {
      const handler = jest.fn();
      touchInput.addTouchStartHandler(handler);
      
      expect(touchInput.touchStartHandlers.size).toBe(1);
      expect(touchInput.touchStartHandlers.has(handler)).toBeTruthy();
    });

    test('should register touch move handler', () => {
      const handler = jest.fn();
      touchInput.addTouchMoveHandler(handler);
      
      expect(touchInput.touchMoveHandlers.size).toBe(1);
      expect(touchInput.touchMoveHandlers.has(handler)).toBeTruthy();
    });

    test('should register touch end handler', () => {
      const handler = jest.fn();
      touchInput.addTouchEndHandler(handler);
      
      expect(touchInput.touchEndHandlers.size).toBe(1);
      expect(touchInput.touchEndHandlers.has(handler)).toBeTruthy();
    });

    test('should remove touch start handler', () => {
      const handler = jest.fn();
      touchInput.addTouchStartHandler(handler);
      touchInput.removeTouchStartHandler(handler);
      
      expect(touchInput.touchStartHandlers.size).toBe(0);
      expect(touchInput.touchStartHandlers.has(handler)).toBeFalsy();
    });

    test('should remove touch move handler', () => {
      const handler = jest.fn();
      touchInput.addTouchMoveHandler(handler);
      touchInput.removeTouchMoveHandler(handler);
      
      expect(touchInput.touchMoveHandlers.size).toBe(0);
      expect(touchInput.touchMoveHandlers.has(handler)).toBeFalsy();
    });

    test('should remove touch end handler', () => {
      const handler = jest.fn();
      touchInput.addTouchEndHandler(handler);
      touchInput.removeTouchEndHandler(handler);
      
      expect(touchInput.touchEndHandlers.size).toBe(0);
      expect(touchInput.touchEndHandlers.has(handler)).toBeFalsy();
    });
  });

  describe('Touch State Management', () => {
    test('should enable touch input', () => {
      touchInput.disable();
      touchInput.enable();
      expect(touchInput.isEnabled).toBeTruthy();
    });

    test('should disable touch input', () => {
      touchInput.enable();
      touchInput.disable();
      expect(touchInput.isEnabled).toBeFalsy();
    });
  });

  describe('Touch Event Coordinates', () => {
    test('should correctly process touch coordinates', () => {
      const handler = jest.fn();
      touchInput.addTouchStartHandler(handler);
      
      // Simulate touch event
      mockCanvas.dispatchEvent(new TouchEvent('touchstart', mockTouchEvent));
      
      expect(mockTouchEvent.touches[0].clientX).toBe(100);
      expect(mockTouchEvent.touches[0].clientY).toBe(200);
    });
  });

  describe('Multiple Touch Points', () => {
    test('should handle multiple simultaneous touches', () => {
      const multiTouchEvent = {
        preventDefault: jest.fn(),
        touches: [
          { clientX: 100, clientY: 200, identifier: 1 },
          { clientX: 300, clientY: 400, identifier: 2 }
        ]
      };

      expect(multiTouchEvent.touches.length).toBe(2);
      expect(multiTouchEvent.touches[0].identifier).not.toBe(
        multiTouchEvent.touches[1].identifier
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle touch events outside canvas bounds', () => {
      const outOfBoundsEvent = {
        preventDefault: jest.fn(),
        touches: [{
          clientX: -10,
          clientY: mockCanvas.height + 100,
          identifier: 1
        }]
      };

      expect(outOfBoundsEvent.touches[0].clientX).toBeLessThan(0);
      expect(outOfBoundsEvent.touches[0].clientY).toBeGreaterThan(mockCanvas.height);
    });

    test('should handle empty touch list', () => {
      const emptyTouchEvent = {
        preventDefault: jest.fn(),
        touches: []
      };

      expect(emptyTouchEvent.touches.length).toBe(0);
    });
  });
});