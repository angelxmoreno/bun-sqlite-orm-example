import { User } from '@/entities';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const userRoutes = new Hono();

userRoutes.get('/', async (c) => {
    const users = await User.find({});
    return c.json(users);
});

userRoutes.get('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid user ID' });
    }

    const user = await User.get(id);
    if (!user) {
        throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json(user);
});

userRoutes.post('/', async (c) => {
    const body = await c.req.json();

    const { email, username, firstName, lastName, bio, avatar } = body;

    if (!email || !username || !firstName || !lastName) {
        throw new HTTPException(400, {
            message: 'Missing required fields: email, username, firstName, lastName',
        });
    }

    try {
        const user = User.build({ email, username, firstName, lastName, bio, avatar });
        await user.save();
        return c.json(user, 201);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to create user' });
    }
});

userRoutes.put('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid user ID' });
    }

    const user = await User.get(id);
    if (!user) {
        throw new HTTPException(404, { message: 'User not found' });
    }

    const body = await c.req.json();

    try {
        await user.update(body);
        return c.json(user);
    } catch (error) {
        throw new HTTPException(400, { message: 'Failed to update user' });
    }
});

userRoutes.delete('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid user ID' });
    }

    const user = await User.get(id);
    if (!user) {
        throw new HTTPException(404, { message: 'User not found' });
    }

    await user.remove();
    return c.json({ message: 'User deleted successfully' });
});
