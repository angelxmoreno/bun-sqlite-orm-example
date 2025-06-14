import { beforeAll, describe, expect, it } from 'bun:test';

// Set test environment before any imports
process.env.DATABASE_PATH = ':memory:';
process.env.API_KEY = 'test-api-key';

describe('API Parameter Validation - Real Routes', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Testing utility needs flexible typing
    let app: any;

    beforeAll(async () => {
        // Import after setting env vars
        const appModule = await import('@/index');
        app = appModule.app;
    });

    describe('Invalid ID Parameter Tests', () => {
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

    describe('Authentication Tests', () => {
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

            // Should be 200 (empty array) if DB is working, or 500 if DB setup fails
            // Either way, it means auth passed (not 401)
            expect([200, 500]).toContain(res.status);
        });
    });

    describe('Root Endpoint', () => {
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
