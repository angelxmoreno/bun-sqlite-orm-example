import { appConfig } from '@/config/index';
import { Category, Comment, Post, Tag, User } from '@/entities';
import { DataSource, PinoDbLogger } from 'bun-sqlite-orm';

export const dataSource = new DataSource({
    database: appConfig.database.path,
    entities: [User, Post, Category, Tag, Comment],
    logger: new PinoDbLogger({ level: 'debug' }),
});

export async function initializeDatabase() {
    try {
        await dataSource.initialize();
        await dataSource.runMigrations();
        return dataSource;
    } catch (err) {
        // Log once with full context and re-throw for the caller to decide.
        console.error('❌ Failed to initialise database', err);
        throw err;
    }
}
