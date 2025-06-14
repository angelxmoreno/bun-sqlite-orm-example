import { appConfig } from '@/config';
import { initializeDatabase } from '@/config/database';
import { authMiddleware } from '@/middleware/auth';
import { categoryRoutes } from '@/routes/categories';
import { commentRoutes } from '@/routes/comments';
import { postRoutes } from '@/routes/posts';
import { tagRoutes } from '@/routes/tags';
import { userRoutes } from '@/routes/users';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => {
    return c.json({
        message: 'Blog/CMS API - Built with Bun, TypeScript, Hono, and bun-sqlite-orm',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            posts: '/api/posts',
            categories: '/api/categories',
            tags: '/api/tags',
            comments: '/api/comments',
        },
    });
});

app.use('/api/*', authMiddleware);

app.route('/api/users', userRoutes);
app.route('/api/posts', postRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/tags', tagRoutes);
app.route('/api/comments', commentRoutes);

// Initialize database before starting server
await initializeDatabase();

console.log(`🚀 Server running on port ${appConfig.server.port}`);
console.log(`📊 Database: ${appConfig.database.path}`);

export { app };

export default {
    port: appConfig.server.port,
    fetch: app.fetch,
};
