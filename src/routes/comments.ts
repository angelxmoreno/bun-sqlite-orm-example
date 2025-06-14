import { Comment, Post, User } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';

export const commentRoutes = new Hono();

commentRoutes.get('/', async (c) => {
    const comments = await Comment.find({});
    return c.json(comments);
});

commentRoutes.get(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid comment ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const comment = await Comment.get(id);

        if (!comment) {
            throw new HTTPException(404, { message: 'Comment not found' });
        }

        return c.json(comment);
    }
);

commentRoutes.post('/', async (c) => {
    const body = await c.req.json();

    const { content, authorId, postId, parentId } = body;

    if (!content || !authorId || !postId) {
        throw new HTTPException(400, {
            message: 'Missing required fields: content, authorId, postId',
        });
    }

    const author = await User.get(authorId);
    if (!author) {
        throw new HTTPException(400, { message: 'Author not found' });
    }

    const post = await Post.get(postId);
    if (!post) {
        throw new HTTPException(400, { message: 'Post not found' });
    }

    const commentData = {
        content,
        authorId,
        postId,
        parentId: parentId || undefined,
    };

    if (parentId) {
        const parent = await Comment.get(parentId);
        if (!parent) {
            throw new HTTPException(400, { message: 'Parent comment not found' });
        }
    }

    try {
        const comment = Comment.build(commentData);
        await comment.save();
        return c.json(comment, 201);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to create comment' });
    }
});

commentRoutes.put(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid comment ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const comment = await Comment.get(id);
        if (!comment) {
            throw new HTTPException(404, { message: 'Comment not found' });
        }

        const body = await c.req.json();

        try {
            await comment.update(body);
            return c.json(comment);
        } catch (error) {
            throw new HTTPException(400, { message: 'Failed to update comment' });
        }
    }
);

commentRoutes.delete(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid comment ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const comment = await Comment.get(id);
        if (!comment) {
            throw new HTTPException(404, { message: 'Comment not found' });
        }

        await comment.remove();
        return c.json({ message: 'Comment deleted successfully' });
    }
);
