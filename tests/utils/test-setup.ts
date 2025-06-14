import { afterEach, beforeEach } from 'bun:test';
import { Category, Comment, Post, PostStatus, Tag, User } from '@/entities';
import { DataSource, PinoDbLogger } from 'bun-sqlite-orm';

// Test database configuration
let testDataSource: DataSource;

// Initialize test database before each test
export async function setupTestDatabase() {
    // Create a fresh in-memory database for each test
    testDataSource = new DataSource({
        database: ':memory:',
        entities: [User, Post, Category, Tag, Comment],
        logger: new PinoDbLogger({ level: 'error' }), // Reduce log noise in tests
    });

    await testDataSource.initialize();
    await testDataSource.runMigrations();
}

// Clean up test data after each test
export async function cleanupTestDatabase() {
    // Clear all tables in reverse dependency order
    const comments = await Comment.find({});
    for (const comment of comments) {
        await comment.remove();
    }

    const posts = await Post.find({});
    for (const post of posts) {
        await post.remove();
    }

    const tags = await Tag.find({});
    for (const tag of tags) {
        await tag.remove();
    }

    const categories = await Category.find({});
    for (const category of categories) {
        await category.remove();
    }

    const users = await User.find({});
    for (const user of users) {
        await user.remove();
    }
}

// Test data factories
export const createTestUser = async (overrides: Partial<User> = {}) => {
    const user = User.build({
        email: `test-${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        ...overrides,
    });
    await user.save();
    return user;
};

export const createTestCategory = async (overrides: Partial<Category> = {}) => {
    const category = Category.build({
        name: `Test Category ${Date.now()}`,
        slug: `test-category-${Date.now()}`,
        description: 'Test category description',
        ...overrides,
    });
    await category.save();
    return category;
};

export const createTestTag = async (overrides: Partial<Tag> = {}) => {
    const tag = Tag.build({
        name: `Test Tag ${Date.now()}`,
        slug: `test-tag-${Date.now()}`,
        color: '#ff0000',
        ...overrides,
    });
    await tag.save();
    return tag;
};

export const createTestPost = async (authorId: number, overrides: Partial<Post> = {}) => {
    const post = Post.build({
        title: `Test Post ${Date.now()}`,
        slug: `test-post-${Date.now()}`,
        content: 'Test post content',
        excerpt: 'Test excerpt',
        status: PostStatus.DRAFT,
        authorId,
        ...overrides,
    });
    await post.save();
    return post;
};

export const createTestComment = async (authorId: number, postId: number, overrides: Partial<Comment> = {}) => {
    const comment = Comment.build({
        content: `Test comment ${Date.now()}`,
        authorId,
        postId,
        ...overrides,
    });
    await comment.save();
    return comment;
};

// Auth headers for testing
export const authHeaders = {
    'X-API-Key': 'test-api-key',
    'Content-Type': 'application/json',
};
