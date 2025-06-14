export const appConfig = {
    database: {
        path: Bun.env.DATABASE_PATH || 'db/blog.db',
    },
    server: {
        port: Number.parseInt(Bun.env.PORT || '3000'),
    },
    auth: {
        apiKey: Bun.env.API_KEY || 'your-secret-key',
    },
};
