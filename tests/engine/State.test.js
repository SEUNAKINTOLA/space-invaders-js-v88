/**
 * @jest-environment jsdom
 */

describe('State Management System', () => {
    let State;
    
    beforeEach(() => {
        // Reset the state before each test
        jest.resetModules();
        State = {
            gameState: {},
            subscribers: new Set(),
            
            // Initialize state with default values
            initialize() {
                this.gameState = {
                    score: 0,
                    level: 1,
                    lives: 3,
                    isGameOver: false,
                    isPaused: false,
                    entities: [],
                    lastUpdate: Date.now()
                };
                return this.gameState;
            },
            
            // Subscribe to state changes
            subscribe(callback) {
                this.subscribers.add(callback);
                return () => this.subscribers.delete(callback);
            },
            
            // Update state and notify subscribers
            update(newState) {
                this.gameState = { ...this.gameState, ...newState };
                this.notifySubscribers();
                return this.gameState;
            },
            
            // Get current state
            getState() {
                return { ...this.gameState };
            },
            
            // Notify all subscribers of state change
            notifySubscribers() {
                this.subscribers.forEach(callback => callback(this.getState()));
            }
        };
    });

    describe('State Initialization', () => {
        test('should initialize with default values', () => {
            const initialState = State.initialize();
            
            expect(initialState).toEqual({
                score: 0,
                level: 1,
                lives: 3,
                isGameOver: false,
                isPaused: false,
                entities: [],
                lastUpdate: expect.any(Number)
            });
        });
    });

    describe('State Updates', () => {
        test('should update state correctly', () => {
            State.initialize();
            const newState = {
                score: 100,
                level: 2
            };
            
            const updatedState = State.update(newState);
            
            expect(updatedState.score).toBe(100);
            expect(updatedState.level).toBe(2);
            // Other properties should remain unchanged
            expect(updatedState.lives).toBe(3);
            expect(updatedState.isGameOver).toBe(false);
        });

        test('should not mutate previous state', () => {
            State.initialize();
            const originalState = State.getState();
            
            State.update({ score: 500 });
            
            expect(originalState.score).toBe(0);
        });
    });

    describe('State Subscriptions', () => {
        test('should notify subscribers on state change', () => {
            State.initialize();
            const mockSubscriber = jest.fn();
            
            State.subscribe(mockSubscriber);
            State.update({ score: 200 });
            
            expect(mockSubscriber).toHaveBeenCalledWith(expect.objectContaining({
                score: 200
            }));
        });

        test('should allow unsubscribing', () => {
            State.initialize();
            const mockSubscriber = jest.fn();
            
            const unsubscribe = State.subscribe(mockSubscriber);
            unsubscribe();
            State.update({ score: 300 });
            
            expect(mockSubscriber).not.toHaveBeenCalled();
        });

        test('should handle multiple subscribers', () => {
            State.initialize();
            const mockSubscriber1 = jest.fn();
            const mockSubscriber2 = jest.fn();
            
            State.subscribe(mockSubscriber1);
            State.subscribe(mockSubscriber2);
            State.update({ level: 3 });
            
            expect(mockSubscriber1).toHaveBeenCalledTimes(1);
            expect(mockSubscriber2).toHaveBeenCalledTimes(1);
        });
    });

    describe('State Access', () => {
        test('should return copy of state', () => {
            State.initialize();
            const state = State.getState();
            state.score = 1000; // Modify the returned state
            
            expect(State.getState().score).toBe(0); // Original state should be unchanged
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty update object', () => {
            State.initialize();
            const beforeState = State.getState();
            
            State.update({});
            
            expect(State.getState()).toEqual(beforeState);
        });

        test('should handle undefined subscriber', () => {
            State.initialize();
            
            expect(() => {
                State.subscribe(undefined);
            }).toThrow();
        });

        test('should handle multiple rapid updates', () => {
            State.initialize();
            const mockSubscriber = jest.fn();
            State.subscribe(mockSubscriber);
            
            for (let i = 0; i < 100; i++) {
                State.update({ score: i });
            }
            
            expect(mockSubscriber).toHaveBeenCalledTimes(100);
            expect(State.getState().score).toBe(99);
        });
    });
});