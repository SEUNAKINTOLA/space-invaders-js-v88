/**
 * Performance tests for the Space Invaders game engine
 * Tests canvas rendering speed, game loop timing, and object management
 * 
 * @jest-environment jsdom
 */

describe('Game Engine Performance', () => {
    let canvas;
    let ctx;
    let gameEngine;
    const TEST_DURATION = 5000; // 5 seconds
    const FRAME_SAMPLE_SIZE = 100;
    
    beforeEach(() => {
        // Setup canvas and context
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        ctx = canvas.getContext('2d');
        
        // Mock performance.now() for consistent testing
        jest.spyOn(performance, 'now').mockImplementation(() => Date.now());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * Measures frames per second over a given duration
     * @param {Function} renderFn - Function to execute each frame
     * @param {number} duration - Test duration in milliseconds
     * @returns {number} Average FPS
     */
    const measureFPS = async (renderFn, duration) => {
        const startTime = performance.now();
        let frames = 0;
        const frameTimes = [];

        while (performance.now() - startTime < duration) {
            const frameStart = performance.now();
            await renderFn();
            const frameTime = performance.now() - frameStart;
            frameTimes.push(frameTime);
            frames++;
        }

        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        return {
            fps: 1000 / avgFrameTime,
            frameTime: avgFrameTime,
            totalFrames: frames
        };
    };

    /**
     * Creates test game objects for performance measurement
     * @param {number} count - Number of objects to create
     * @returns {Array} Array of test objects
     */
    const createTestObjects = (count) => {
        const objects = [];
        for (let i = 0; i < count; i++) {
            objects.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 32,
                height: 32,
                velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
            });
        }
        return objects;
    };

    test('Canvas rendering performance with increasing object count', async () => {
        const objectCounts = [10, 100, 1000];
        const results = {};

        for (const count of objectCounts) {
            const objects = createTestObjects(count);
            
            const renderFunction = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                objects.forEach(obj => {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                    
                    // Simple movement simulation
                    obj.x += obj.velocity.x;
                    obj.y += obj.velocity.y;
                    
                    // Bounce off walls
                    if (obj.x <= 0 || obj.x >= canvas.width - obj.width) obj.velocity.x *= -1;
                    if (obj.y <= 0 || obj.y >= canvas.height - obj.height) obj.velocity.y *= -1;
                });
            };

            const metrics = await measureFPS(renderFunction, TEST_DURATION);
            results[count] = metrics;

            // Performance assertions
            expect(metrics.fps).toBeGreaterThan(30); // Minimum acceptable FPS
            expect(metrics.frameTime).toBeLessThan(33.33); // Max 33.33ms per frame (30 FPS)
        }

        console.table(results);
    });

    test('Game loop timing consistency', async () => {
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;
        const frameTimes = [];

        const simulateGameLoop = async () => {
            const startTime = performance.now();
            
            // Simulate game update
            await new Promise(resolve => setTimeout(resolve, 1));
            
            return performance.now() - startTime;
        };

        // Collect frame timing samples
        for (let i = 0; i < FRAME_SAMPLE_SIZE; i++) {
            const frameTime = await simulateGameLoop();
            frameTimes.push(frameTime);
        }

        // Calculate timing statistics
        const avgFrameTime = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
        const variance = frameTimes.reduce((acc, time) => 
            acc + Math.pow(time - avgFrameTime, 2), 0) / frameTimes.length;
        const stdDev = Math.sqrt(variance);

        // Assertions for timing consistency
        expect(avgFrameTime).toBeLessThan(frameInterval);
        expect(stdDev).toBeLessThan(frameInterval * 0.1); // Max 10% deviation
    });

    test('Memory usage during continuous rendering', async () => {
        const initialMemory = performance.memory?.usedJSHeapSize || 0;
        const objects = createTestObjects(500);
        
        const renderFunction = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            objects.forEach(obj => {
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            });
        };

        // Run continuous rendering for test duration
        await measureFPS(renderFunction, TEST_DURATION);

        const finalMemory = performance.memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;

        // Assert reasonable memory usage (less than 10MB increase)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
});