import { Category } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';

export const categoryRoutes = new Hono();

categoryRoutes.get('/', async (c) => {
    const categories = await Category.find({});
    return c.json(categories);
});

categoryRoutes.get(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid category ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const category = await Category.get(id);

        if (!category) {
            throw new HTTPException(404, { message: 'Category not found' });
        }

        return c.json(category);
    }
);

categoryRoutes.post('/', async (c) => {
    const body = await c.req.json();

    const { name, slug, description } = body;

    if (!name || !slug) {
        throw new HTTPException(400, {
            message: 'Missing required fields: name, slug',
        });
    }

    try {
        const category = Category.build({ name, slug, description });
        await category.save();
        return c.json(category, 201);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to create category' });
    }
});

categoryRoutes.put(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid category ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const category = await Category.get(id);
        if (!category) {
            throw new HTTPException(404, { message: 'Category not found' });
        }

        const body = await c.req.json();

        try {
            await category.update(body);
            return c.json(category);
        } catch (error) {
            throw new HTTPException(400, { message: 'Failed to update category' });
        }
    }
);

categoryRoutes.delete(
    '/:id',
    validator('param', (value, c) => {
        const id = Number(value.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new HTTPException(400, {
                message: 'Invalid category ID',
            });
        }
        return { id };
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const category = await Category.get(id);
        if (!category) {
            throw new HTTPException(404, { message: 'Category not found' });
        }

        await category.remove();
        return c.json({ message: 'Category deleted successfully' });
    }
);
