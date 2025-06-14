import { Tag } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const tagRoutes = new Hono();

tagRoutes.get('/', async (c) => {
    const tags = await Tag.find({});
    return c.json(tags);
});

tagRoutes.get('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid tag ID' });
    }

    const tag = await Tag.get(id);

    if (!tag) {
        throw new HTTPException(404, { message: 'Tag not found' });
    }

    return c.json(tag);
});

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

tagRoutes.put('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid tag ID' });
    }

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
});

tagRoutes.delete('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid tag ID' });
    }

    const tag = await Tag.get(id);
    if (!tag) {
        throw new HTTPException(404, { message: 'Tag not found' });
    }

    await tag.remove();
    return c.json({ message: 'Tag deleted successfully' });
});
