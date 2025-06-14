import { appConfig } from '@/config';
import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export async function authMiddleware(c: Context, next: Next) {
    const apiKey = c.req.header('X-API-Key') || c.req.query('api_key');

    if (!apiKey) {
        throw new HTTPException(401, {
            message: 'API key is required. Provide it via X-API-Key header or api_key query parameter.',
        });
    }

    if (apiKey !== appConfig.auth.apiKey) {
        throw new HTTPException(401, {
            message: 'Invalid API key.',
        });
    }

    await next();
}
