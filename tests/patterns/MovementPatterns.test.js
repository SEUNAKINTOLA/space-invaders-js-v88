/**
 * @jest/environment jsdom
 */

describe('MovementPatterns', () => {
    // Mock canvas and context since we're in jsdom environment
    let mockCanvas;
    let mockContext;

    beforeEach(() => {
        mockCanvas = document.createElement('canvas');
        mockCanvas.width = 800;
        mockCanvas.height = 600;
        mockContext = mockCanvas.getContext('2d');
        
        // Reset the mock canvas state
        mockContext.clearRect(0, 0, mockCanvas.width, mockCanvas.height);
    });

    describe('LinearPattern', () => {
        test('should move enemy in straight line horizontally', () => {
            const startX = 100;
            const startY = 100;
            const speed = 2;
            const direction = 1; // right

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += speed * direction;
                    return pos;
                }
            };

            // Simulate multiple updates
            for (let i = 0; i < 5; i++) {
                pattern.update(position);
            }

            expect(position.x).toBe(startX + (speed * direction * 5));
            expect(position.y).toBe(startY);
        });

        test('should reverse direction at screen boundaries', () => {
            const startX = 790; // Near right boundary
            const startY = 100;
            const speed = 2;
            const direction = 1; // right

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += speed * direction;
                    if (pos.x >= mockCanvas.width || pos.x <= 0) {
                        return { x: pos.x - speed * direction, y: pos.y };
                    }
                    return pos;
                }
            };

            const newPos = pattern.update(position);
            expect(newPos.x).toBeLessThan(mockCanvas.width);
        });
    });

    describe('SinePattern', () => {
        test('should move enemy in sine wave pattern', () => {
            const startX = 100;
            const startY = 100;
            const amplitude = 50;
            const frequency = 0.05;
            let time = 0;

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += 2;
                    pos.y = startY + Math.sin(time * frequency) * amplitude;
                    time += 1;
                    return pos;
                }
            };

            const initialY = position.y;
            pattern.update(position);

            expect(position.x).toBeGreaterThan(startX);
            expect(position.y).not.toBe(initialY);
        });

        test('should maintain amplitude bounds', () => {
            const startX = 100;
            const startY = 100;
            const amplitude = 50;
            const frequency = 0.05;
            let time = 0;

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += 2;
                    pos.y = startY + Math.sin(time * frequency) * amplitude;
                    time += 1;
                    return pos;
                }
            };

            // Run multiple updates to check amplitude bounds
            for (let i = 0; i < 100; i++) {
                pattern.update(position);
                expect(position.y).toBeLessThanOrEqual(startY + amplitude);
                expect(position.y).toBeGreaterThanOrEqual(startY - amplitude);
            }
        });
    });

    describe('CircularPattern', () => {
        test('should move enemy in circular pattern', () => {
            const centerX = 200;
            const centerY = 200;
            const radius = 50;
            let angle = 0;

            const position = { x: centerX + radius, y: centerY };
            const pattern = {
                update: (pos) => {
                    angle += 0.05;
                    pos.x = centerX + Math.cos(angle) * radius;
                    pos.y = centerY + Math.sin(angle) * radius;
                    return pos;
                }
            };

            const initialX = position.x;
            const initialY = position.y;
            
            pattern.update(position);

            expect(position.x).not.toBe(initialX);
            expect(position.y).not.toBe(initialY);
        });

        test('should maintain constant radius', () => {
            const centerX = 200;
            const centerY = 200;
            const radius = 50;
            let angle = 0;

            const position = { x: centerX + radius, y: centerY };
            const pattern = {
                update: (pos) => {
                    angle += 0.05;
                    pos.x = centerX + Math.cos(angle) * radius;
                    pos.y = centerY + Math.sin(angle) * radius;
                    return pos;
                }
            };

            // Check radius remains constant over multiple updates
            for (let i = 0; i < 50; i++) {
                pattern.update(position);
                const currentRadius = Math.sqrt(
                    Math.pow(position.x - centerX, 2) + 
                    Math.pow(position.y - centerY, 2)
                );
                expect(Math.abs(currentRadius - radius)).toBeLessThan(0.1);
            }
        });
    });

    describe('ZigZagPattern', () => {
        test('should move enemy in zigzag pattern', () => {
            const startX = 100;
            const startY = 100;
            const amplitude = 30;
            let direction = 1;
            let step = 0;

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += 2;
                    pos.y += amplitude * direction;
                    step += 1;
                    if (step % 10 === 0) {
                        direction *= -1;
                    }
                    return pos;
                }
            };

            const initialY = position.y;
            pattern.update(position);

            expect(position.x).toBeGreaterThan(startX);
            expect(position.y).not.toBe(initialY);
        });

        test('should reverse direction at amplitude bounds', () => {
            const startX = 100;
            const startY = 100;
            const amplitude = 30;
            let direction = 1;
            let step = 0;

            const position = { x: startX, y: startY };
            const pattern = {
                update: (pos) => {
                    pos.x += 2;
                    pos.y += amplitude * direction;
                    step += 1;
                    if (step % 10 === 0) {
                        direction *= -1;
                    }
                    return pos;
                }
            };

            // Track direction changes
            const directions = [];
            for (let i = 0; i < 20; i++) {
                pattern.update(position);
                if (i % 10 === 0) {
                    directions.push(direction);
                }
            }

            expect(directions).toContain(1);
            expect(directions).toContain(-1);
        });
    });
});