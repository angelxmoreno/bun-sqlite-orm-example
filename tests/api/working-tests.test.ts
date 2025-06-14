import { beforeAll, describe, expect, it } from 'bun:test';
import type { Hono } from 'hono';

// Set test environment before any imports
process.env.DATABASE_PATH = ':memory:';
process.env.API_KEY = 'test-api-key';

describe('Working API Tests', () => {
    let app: Hono;

    beforeAll(async () => {
        // Import after setting env vars
        const appModule = await import('@/index');
        app = appModule.app;
    });

    describe('Parameter Validation - Real API Routes', () => {
        const routes = ['/api/users', '/api/categories', '/api/posts', '/api/tags', '/api/comments'];
        const invalidIds = ['12abc', 'abc123', '0', '-1', '12.5'];

        for (const route of routes) {
            for (const invalidId of invalidIds) {
                it(`should reject ${route}/${invalidId} with 400`, async () => {
                    const res = await app.request(`${route}/${invalidId}`, {
                        method: 'GET',
                        headers: {
                            'X-API-Key': 'test-api-key',
                        },
                    });

                    expect(res.status).toBe(400);
                });
            }
        }
    });

    describe('Authentication', () => {
        it('should reject requests without API key', async () => {
            const res = await app.request('/api/users', {
                method: 'GET',
            });

            expect(res.status).toBe(401);
        });

        it('should reject requests with invalid API key', async () => {
            const res = await app.request('/api/users', {
                method: 'GET',
                headers: {
                    'X-API-Key': 'invalid-key',
                },
            });

            expect(res.status).toBe(401);
        });

        it('should accept requests with valid API key', async () => {
            const res = await app.request('/api/users', {
                method: 'GET',
                headers: {
                    'X-API-Key': 'test-api-key',
                },
            });

            expect(res.status).toBe(200);
        });
    });

    describe('CRUD Operations', () => {
        it('should handle user creation with valid data', async () => {
            const userData = {
                email: 'test@example.com',
                username: 'testuser',
                firstName: 'Test',
                lastName: 'User',
                bio: 'Test bio',
            };

            const res = await app.request('/api/users', {
                method: 'POST',
                headers: {
                    'X-API-Key': 'test-api-key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            expect(res.status).toBe(201);
            const user = await res.json();
            expect(user.email).toBe(userData.email);
            expect(user.username).toBe(userData.username);
        });

        it('should reject user creation with missing required fields', async () => {
            const incompleteData = {
                email: 'test@example.com',
                // missing username, firstName, lastName
            };

            const res = await app.request('/api/users', {
                method: 'POST',
                headers: {
                    'X-API-Key': 'test-api-key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incompleteData),
            });

            expect(res.status).toBe(400);
        });
    });

    describe('Root endpoint', () => {
        it('should return API info at root', async () => {
            const res = await app.request('/', {
                method: 'GET',
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.message).toContain('Blog/CMS API');
            expect(body.endpoints).toBeDefined();
        });
    });
});
