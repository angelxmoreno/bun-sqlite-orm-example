import { Post, PostStatus, User } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';

export const postRoutes = new Hono();

postRoutes.get('/', async (c) => {
    const posts = await Post.find({});
    return c.json(posts);
});

postRoutes.get(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid post ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const post = await Post.get(id);
        if (!post) {
            throw new HTTPException(404, { message: 'Post not found' });
        }

        return c.json(post);
    }
);

postRoutes.post('/', async (c) => {
    const body = await c.req.json();

    const { title, slug, content, excerpt, featuredImage, status, authorId } = body;

    if (!title || !slug || !content || !authorId) {
        throw new HTTPException(400, {
            message: 'Missing required fields: title, slug, content, authorId',
        });
    }

    const author = await User.get(authorId);
    if (!author) {
        throw new HTTPException(400, { message: 'Author not found' });
    }

    const postData: Partial<Post> = {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status: status || PostStatus.DRAFT,
        authorId,
    };

    if (status === PostStatus.PUBLISHED) {
        postData.publishedAt = new Date();
    }

    try {
        const post = Post.build(postData);
        await post.save();
        return c.json(post, 201);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to create post' });
    }
});

postRoutes.put(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid post ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const post = await Post.get(id);
        if (!post) {
            throw new HTTPException(404, { message: 'Post not found' });
        }

        const body = await c.req.json();
        const { authorId, ...postData } = body;

        if (authorId) {
            const author = await User.get(authorId);
            if (!author) {
                throw new HTTPException(400, { message: 'Author not found' });
            }
            postData.authorId = authorId;
        }

        if (postData.status === PostStatus.PUBLISHED && !post.publishedAt) {
            postData.publishedAt = new Date();
        }

        try {
            await post.update(postData);
            return c.json(post);
        } catch (error) {
            throw new HTTPException(400, { message: 'Failed to update post' });
        }
    }
);

postRoutes.delete(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid post ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const post = await Post.get(id);
        if (!post) {
            throw new HTTPException(404, { message: 'Post not found' });
        }

        await post.remove();
        return c.json({ message: 'Post deleted successfully' });
    }
);
