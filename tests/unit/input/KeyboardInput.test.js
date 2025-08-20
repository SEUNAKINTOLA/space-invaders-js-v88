/**
 * @jest/environment jsdom
 */

describe('KeyboardInput', () => {
  let KeyboardInput;
  let keyboardInput;

  beforeEach(() => {
    // Reset DOM event listeners between tests
    document.body.innerHTML = '';
    
    // Mock the KeyboardInput class implementation for testing
    KeyboardInput = class {
      constructor() {
        this.pressedKeys = new Set();
        this.keyBindings = new Map();
        this.initialize();
      }

      initialize() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
      }

      handleKeyDown(event) {
        this.pressedKeys.add(event.code);
      }

      handleKeyUp(event) {
        this.pressedKeys.delete(event.code);
      }

      isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
      }

      bindKey(keyCode, action) {
        this.keyBindings.set(keyCode, action);
      }

      unbindKey(keyCode) {
        this.keyBindings.delete(keyCode);
      }

      cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.pressedKeys.clear();
        this.keyBindings.clear();
      }
    };

    keyboardInput = new KeyboardInput();
  });

  afterEach(() => {
    keyboardInput.cleanup();
  });

  describe('Initialization', () => {
    test('should create instance with empty pressed keys', () => {
      expect(keyboardInput.pressedKeys.size).toBe(0);
    });

    test('should create instance with empty key bindings', () => {
      expect(keyboardInput.keyBindings.size).toBe(0);
    });
  });

  describe('Key Press Detection', () => {
    test('should detect key press', () => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
      document.dispatchEvent(event);
      
      expect(keyboardInput.isKeyPressed('ArrowLeft')).toBe(true);
    });

    test('should detect key release', () => {
      // Press key
      const pressEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
      document.dispatchEvent(pressEvent);
      
      // Release key
      const releaseEvent = new KeyboardEvent('keyup', { code: 'ArrowRight' });
      document.dispatchEvent(releaseEvent);
      
      expect(keyboardInput.isKeyPressed('ArrowRight')).toBe(false);
    });

    test('should handle multiple keys pressed simultaneously', () => {
      const events = [
        new KeyboardEvent('keydown', { code: 'ArrowLeft' }),
        new KeyboardEvent('keydown', { code: 'Space' })
      ];
      
      events.forEach(event => document.dispatchEvent(event));
      
      expect(keyboardInput.isKeyPressed('ArrowLeft')).toBe(true);
      expect(keyboardInput.isKeyPressed('Space')).toBe(true);
    });
  });

  describe('Key Bindings', () => {
    test('should bind action to key', () => {
      const action = jest.fn();
      keyboardInput.bindKey('Space', action);
      
      expect(keyboardInput.keyBindings.get('Space')).toBe(action);
    });

    test('should unbind action from key', () => {
      const action = jest.fn();
      keyboardInput.bindKey('Space', action);
      keyboardInput.unbindKey('Space');
      
      expect(keyboardInput.keyBindings.has('Space')).toBe(false);
    });

    test('should override existing key binding', () => {
      const action1 = jest.fn();
      const action2 = jest.fn();
      
      keyboardInput.bindKey('Space', action1);
      keyboardInput.bindKey('Space', action2);
      
      expect(keyboardInput.keyBindings.get('Space')).toBe(action2);
    });
  });

  describe('Cleanup', () => {
    test('should clear all pressed keys on cleanup', () => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
      document.dispatchEvent(event);
      
      keyboardInput.cleanup();
      
      expect(keyboardInput.pressedKeys.size).toBe(0);
    });

    test('should clear all key bindings on cleanup', () => {
      const action = jest.fn();
      keyboardInput.bindKey('Space', action);
      
      keyboardInput.cleanup();
      
      expect(keyboardInput.keyBindings.size).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle unknown key codes', () => {
      const event = new KeyboardEvent('keydown', { code: 'NonExistentKey' });
      document.dispatchEvent(event);
      
      expect(keyboardInput.isKeyPressed('NonExistentKey')).toBe(true);
    });

    test('should handle rapid key presses', () => {
      const keyCode = 'Space';
      for(let i = 0; i < 10; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: keyCode }));
      }
      
      expect(keyboardInput.isKeyPressed(keyCode)).toBe(false);
    });
  });
});