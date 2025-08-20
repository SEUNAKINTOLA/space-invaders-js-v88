/**
 * @fileoverview Performance tests for the rendering system
 * Tests frame rate, render time, and memory usage under different loads
 */

// Standard performance testing utilities
const { performance, PerformanceObserver } = require('perf_hooks');

describe('Rendering System Performance', () => {
  // Test configuration
  const TEST_DURATION = 5000; // 5 seconds
  const FRAME_SAMPLE_SIZE = 100;
  const SPRITE_COUNTS = [10, 100, 1000]; // Test with different numbers of sprites
  
  let canvas;
  let ctx;
  let renderer;
  let gameLoop;
  
  /**
   * Creates a mock sprite with random properties for testing
   * @returns {Object} Mock sprite object
   */
  const createMockSprite = () => ({
    x: Math.random() * 800,
    y: Math.random() * 600,
    width: 32,
    height: 32,
    color: '#FF0000'
  });

  /**
   * Measures average frame time over multiple frames
   * @param {number} numFrames Number of frames to measure
   * @param {Function} renderFn Render function to test
   * @returns {Promise<number>} Average frame time in milliseconds
   */
  const measureAverageFrameTime = async (numFrames, renderFn) => {
    const frameTimes = [];
    
    for (let i = 0; i < numFrames; i++) {
      const startTime = performance.now();
      await renderFn();
      const endTime = performance.now();
      frameTimes.push(endTime - startTime);
    }

    return frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  };

  beforeEach(() => {
    // Setup canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d');
    
    // Create performance observer
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`Performance Entry: ${entry.name}: ${entry.duration}`);
      });
    });
    obs.observe({ entryTypes: ['measure'], buffered: true });
  });

  afterEach(() => {
    // Cleanup
    performance.clearMarks();
    performance.clearMeasures();
  });

  test('should maintain target frame rate with different sprite counts', async () => {
    const TARGET_FPS = 60;
    const FRAME_TIME_THRESHOLD = 1000 / TARGET_FPS; // ~16.67ms

    for (const spriteCount of SPRITE_COUNTS) {
      const sprites = Array(spriteCount).fill(null).map(createMockSprite);
      
      performance.mark('render-start');
      
      const averageFrameTime = await measureAverageFrameTime(
        FRAME_SAMPLE_SIZE,
        () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          sprites.forEach(sprite => {
            ctx.fillStyle = sprite.color;
            ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
          });
        }
      );

      performance.mark('render-end');
      performance.measure(
        `Render ${spriteCount} sprites`,
        'render-start',
        'render-end'
      );

      expect(averageFrameTime).toBeLessThan(
        FRAME_TIME_THRESHOLD,
        `Frame time exceeded threshold with ${spriteCount} sprites`
      );
    }
  });

  test('should handle rapid canvas resizing', async () => {
    const RESIZE_COUNT = 50;
    const SIZES = [
      [800, 600],
      [1024, 768],
      [1280, 720],
      [1920, 1080]
    ];

    performance.mark('resize-start');

    for (let i = 0; i < RESIZE_COUNT; i++) {
      const [width, height] = SIZES[i % SIZES.length];
      canvas.width = width;
      canvas.height = height;
      
      // Force a render to ensure resize handling
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      
      // Small delay to simulate realistic resize intervals
      await new Promise(resolve => setTimeout(resolve, 16));
    }

    performance.mark('resize-end');
    performance.measure('Canvas Resizing', 'resize-start', 'resize-end');

    // Verify canvas is in valid state after resizing
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
    expect(ctx).toBeTruthy();
  });

  test('should efficiently handle sprite property updates', async () => {
    const SPRITE_COUNT = 500;
    const UPDATE_CYCLES = 100;
    
    const sprites = Array(SPRITE_COUNT).fill(null).map(createMockSprite);
    
    performance.mark('update-start');

    for (let cycle = 0; cycle < UPDATE_CYCLES; cycle++) {
      sprites.forEach(sprite => {
        sprite.x += Math.random() * 2 - 1;
        sprite.y += Math.random() * 2 - 1;
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sprites.forEach(sprite => {
        ctx.fillStyle = sprite.color;
        ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
      });

      // Simulate frame timing
      await new Promise(resolve => setTimeout(resolve, 16));
    }

    performance.mark('update-end');
    performance.measure('Sprite Updates', 'update-start', 'update-end');

    // Verify all sprites are still within canvas bounds
    sprites.forEach(sprite => {
      expect(sprite.x).toBeGreaterThanOrEqual(0);
      expect(sprite.y).toBeGreaterThanOrEqual(0);
      expect(sprite.x + sprite.width).toBeLessThanOrEqual(canvas.width);
      expect(sprite.y + sprite.height).toBeLessThanOrEqual(canvas.height);
    });
  });
});