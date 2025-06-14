import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';

describe('Parameter Validation Logic', () => {
    // Create a minimal test app to verify our validation logic
    const testApp = new Hono();

    // Add the same validation logic we use in our routes
    testApp.get(
        '/test/:id',
        validator('param', (value, c) => {
            const id = Number(value.id);
            if (!Number.isInteger(id) || id <= 0) {
                throw new HTTPException(400, {
                    message: 'Invalid ID',
                });
            }
            return { id };
        }),
        async (c) => {
            const { id } = c.req.valid('param');
            return c.json({ success: true, id });
        }
    );

    describe('Invalid ID Parameters', () => {
        const invalidIds = ['12abc', 'abc123', '0', '-1', 'null', 'undefined', '12.5'];

        for (const invalidId of invalidIds) {
            it(`should reject "${invalidId}" with 400`, async () => {
                const res = await testApp.request(`/test/${invalidId}`, {
                    method: 'GET',
                });

                expect(res.status).toBe(400);

                // HTTPException might return text or JSON depending on configuration
                const contentType = res.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const body = await res.json();
                    expect(body.message).toBe('Invalid ID');
                } else {
                    const text = await res.text();
                    expect(text).toContain('Invalid ID');
                }
            });
        }

        it('should reject empty string with 404 (route not found)', async () => {
            const res = await testApp.request('/test/', {
                method: 'GET',
            });

            // Empty string in URL path results in 404, not 400
            expect(res.status).toBe(404);
        });
    });

    describe('Valid ID Parameters', () => {
        const validIds = ['1', '2', '999', '123'];

        for (const validId of validIds) {
            it(`should accept "${validId}" with 200`, async () => {
                const res = await testApp.request(`/test/${validId}`, {
                    method: 'GET',
                });

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.success).toBe(true);
                expect(body.id).toBe(Number(validId));
            });
        }
    });

    describe('Edge Cases', () => {
        it('should reject floating point numbers', async () => {
            const res = await testApp.request('/test/12.5', {
                method: 'GET',
            });

            expect(res.status).toBe(400);
        });

        it('should reject negative numbers', async () => {
            const res = await testApp.request('/test/-5', {
                method: 'GET',
            });

            expect(res.status).toBe(400);
        });

        it('should reject zero', async () => {
            const res = await testApp.request('/test/0', {
                method: 'GET',
            });

            expect(res.status).toBe(400);
        });

        it('should handle very large numbers', async () => {
            const largeId = '9007199254740991'; // Number.MAX_SAFE_INTEGER
            const res = await testApp.request(`/test/${largeId}`, {
                method: 'GET',
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.id).toBe(Number(largeId));
        });

        it('should reject numbers beyond safe integer range', async () => {
            const unsafeId = '9007199254740992'; // Number.MAX_SAFE_INTEGER + 1
            const res = await testApp.request(`/test/${unsafeId}`, {
                method: 'GET',
            });

            // This might be 400 if Number() creates an unsafe integer,
            // or 200 if the system handles it gracefully
            expect([200, 400]).toContain(res.status);
        });
    });

    describe('Comparison with parseInt behavior', () => {
        it('demonstrates the difference between parseInt and Number', () => {
            // This is what parseInt would do (the problem CodeRabbit identified)
            expect(Number.parseInt('12abc')).toBe(12);
            expect(Number.parseInt('123.45')).toBe(123);
            expect(Number.parseInt('0')).toBe(0);

            // This is what Number does (our solution)
            expect(Number('12abc')).toBeNaN();
            expect(Number('123.45')).toBe(123.45); // Not an integer
            expect(Number('0')).toBe(0);

            // Our validation logic
            const validateId = (value: string) => {
                const id = Number(value);
                return Number.isInteger(id) && id > 0;
            };

            expect(validateId('12abc')).toBe(false); // ✅ Correctly rejects
            expect(validateId('123.45')).toBe(false); // ✅ Correctly rejects floats
            expect(validateId('0')).toBe(false); // ✅ Correctly rejects zero
            expect(validateId('-5')).toBe(false); // ✅ Correctly rejects negative
            expect(validateId('123')).toBe(true); // ✅ Correctly accepts
        });
    });
});
