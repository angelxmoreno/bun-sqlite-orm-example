import { Tag } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';

export const tagRoutes = new Hono();

tagRoutes.get('/', async (c) => {
    const tags = await Tag.find({});
    return c.json(tags);
});

tagRoutes.get(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid tag ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const tag = await Tag.get(id);

        if (!tag) {
            throw new HTTPException(404, { message: 'Tag not found' });
        }

        return c.json(tag);
    }
);

tagRoutes.post('/', async (c) => {
    const body = await c.req.json();

    const { name, slug, color } = body;

    if (!name || !slug) {
        throw new HTTPException(400, {
            message: 'Missing required fields: name, slug',
        });
    }

    try {
        const tag = Tag.build({ name, slug, color });
        await tag.save();
        return c.json(tag, 201);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to create tag' });
    }
});

tagRoutes.put(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid tag ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const tag = await Tag.get(id);
        if (!tag) {
            throw new HTTPException(404, { message: 'Tag not found' });
        }

        const body = await c.req.json();

        try {
            await tag.update(body);
            return c.json(tag);
        } catch (error) {
            throw new HTTPException(400, { message: 'Failed to update tag' });
        }
    }
);

tagRoutes.delete(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid tag ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const tag = await Tag.get(id);
        if (!tag) {
            throw new HTTPException(404, { message: 'Tag not found' });
        }

        await tag.remove();
        return c.json({ message: 'Tag deleted successfully' });
    }
);
