# Blog/CMS API - bun-sqlite-orm Example

A comprehensive sample project demonstrating how to use [bun-sqlite-orm](https://www.npmjs.com/package/bun-sqlite-orm) to build a modern, type-safe blog/CMS API with Bun, TypeScript, and Hono.

## 🎯 What This Project Demonstrates

This is a **complete, production-ready blog/CMS API** that showcases:

- **Active Record Pattern**: Entities inherit from `BaseEntity` with built-in CRUD methods
- **Entity Relationships**: Foreign key relationships between Users, Posts, Categories, Tags, and Comments
- **Type Safety**: Full TypeScript support with compile-time validation
- **REST API**: Complete CRUD endpoints for all entities
- **Data Seeding**: Realistic test data generation with error handling
- **Authentication**: Simple API key-based authentication
- **Modern Tooling**: Biome for linting, Lefthook for git hooks, TypeScript path aliases

## 🛠️ Technology Stack

- **Runtime**: [Bun](https://bun.sh/) >=1.1.21
- **ORM**: [bun-sqlite-orm](https://www.npmjs.com/package/bun-sqlite-orm) ^1.1.0
- **Web Framework**: [Hono](https://hono.dev/) ^4.7.11
- **Language**: TypeScript with decorators
- **Database**: SQLite (via bun:sqlite)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) ^0.14.2
- **Test Data**: [@faker-js/faker](https://fakerjs.dev/) ^9.8.0

## 🏗️ Database Schema

The project implements a typical blog/CMS schema with the following entities:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │    Post     │    │  Category   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │───▶│ id (PK)     │◄──▶│ id (PK)     │
│ email       │    │ title       │    │ name        │
│ username    │    │ slug        │    │ slug        │
│ firstName   │    │ content     │    │ description │
│ lastName    │    │ authorId    │    │ ...         │
│ bio         │    │ status      │    └─────────────┘
│ avatar      │    │ ...         │           ▲
│ ...         │    └─────────────┘           │
└─────────────┘           │                 │
       │                  │      ┌─────────────┐
       │                  │      │     Tag     │
       │                  │      ├─────────────┤
       │                  │      │ id (PK)     │
       │                  │      │ name        │
       │                  │      │ slug        │
       │                  │      │ color       │
       │                  ▼      │ ...         │
┌─────────────┐           │      └─────────────┘
│   Comment   │           │             ▲
├─────────────┤           │             │
│ id (PK)     │           │             │
│ content     │           │             │
│ authorId    │───────────┘             │
│ postId      │─────────────────────────┘
│ parentId    │ (self-referencing for nested comments)
│ ...         │
└─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) >=1.1.21 installed

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd bun-sqlite-orm-example

# Install dependencies
bun install

# (Optional) Configure environment variables
# The app works with sensible defaults, but you can customize:
cp sample.env .env

# Generate test data
bun run seed

# Start development server
bun run dev
```

### API Testing

The server starts with default configuration, so you can immediately test the API:

```bash
# Test with the default API key
curl -H "X-API-Key: your-secret-key" http://localhost:3000/api/users

# Or use query parameter
curl "http://localhost:3000/api/users?api_key=your-secret-key"
```

> **💡 Quick Start Tip**: No `.env` file needed! The app works immediately with sensible defaults.

## 📡 API Endpoints

All endpoints require authentication via `X-API-Key` header or `api_key` query parameter.

| Resource | Endpoint | Methods | Description |
|----------|----------|---------|-------------|
| Users | `/api/users` | GET, POST, PUT, DELETE | User management |
| Posts | `/api/posts` | GET, POST, PUT, DELETE | Blog posts with author references |
| Categories | `/api/categories` | GET, POST, PUT, DELETE | Post categorization |
| Tags | `/api/tags` | GET, POST, PUT, DELETE | Post tagging |
| Comments | `/api/comments` | GET, POST, PUT, DELETE | Nested commenting system |

### Example Requests

**Create a User:**
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer"
  }'
```

**Create a Post:**
```bash
curl -X POST "http://localhost:3000/api/posts" \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post...",
    "status": "published",
    "authorId": 1
  }'
```

## 🧩 bun-sqlite-orm Key Concepts

### Entity Definition
Entities use decorators and extend `BaseEntity`:

```typescript
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'bun-sqlite-orm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @IsNotEmpty()
    username!: string;
}
```

### DataSource Configuration
Initialize the ORM with entity registration:

```typescript
import { DataSource } from 'bun-sqlite-orm';

export const dataSource = new DataSource({
    database: './blog.db',
    entities: [User, Post, Category, Tag, Comment],
});

await dataSource.initialize();
```

### Active Record Pattern
Entities have built-in CRUD methods:

```typescript
// Create
const user = User.build({ email: 'test@example.com', username: 'test' });
await user.save();

// Read
const users = await User.find({});  // Get all
const user = await User.get(1);     // Get by ID
const filtered = await User.find({ email: 'test@example.com' }); // Filter

// Update
await user.update({ username: 'newname' });

// Delete
await user.remove();
```

## ⚠️ Important Notes for bun-sqlite-orm Users

### 1. **Required Dependencies**
```json
{
  "dependencies": {
    "bun-sqlite-orm": "^1.1.0",
    "class-validator": "^0.14.2"
  }
}
```

### 2. **TypeScript Configuration**
Enable decorators in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 3. **Entity Relationships**
- Use **foreign key IDs** for relationships (e.g., `authorId`, `postId`)
- The ORM doesn't have built-in relationship decorators like TypeORM
- Implement relationships manually in your business logic

### 4. **Query Methods**
- `find({})` requires an argument (empty object for all records)
- `get(id)` for single record by primary key
- `build()` creates instances, `save()` persists them
- `update()` modifies existing records
- `remove()` deletes records

### 5. **Validation**
- Use `class-validator` decorators on entity properties
- Validation happens automatically during save operations

### 6. **Database Migrations**
- Tables are created automatically from entity metadata
- Use `dataSource.runMigrations()` for schema updates

### 7. **Error Handling**
- Always wrap database operations in try/catch blocks
- Entity creation can fail due to validation or constraint violations

## 📁 Project Structure

```
src/
├── config/
│   ├── database.ts         # DataSource configuration
│   └── index.ts            # App configuration
├── entities/
│   ├── User.ts             # User entity definition
│   ├── Post.ts             # Post entity definition
│   ├── Category.ts         # Category entity definition
│   ├── Tag.ts              # Tag entity definition
│   ├── Comment.ts          # Comment entity definition
│   └── index.ts            # Entity exports
├── middleware/
│   └── auth.ts             # API key authentication
├── routes/
│   ├── users.ts            # User CRUD endpoints
│   ├── posts.ts            # Post CRUD endpoints
│   ├── categories.ts       # Category CRUD endpoints
│   ├── tags.ts             # Tag CRUD endpoints
│   └── comments.ts         # Comment CRUD endpoints
├── scripts/
│   └── seed.ts             # Database seeding script
└── index.ts                # Server entry point
```

## 🛠️ Development Scripts

```bash
# Development with hot reload
bun run dev

# Production server
bun run start

# Generate test data
bun run seed

# Code quality
bun run lint
bun run lint:fix
```

## 🔧 Configuration

The application works out-of-the-box with sensible defaults. Environment variables are **optional** but can be customized by copying `sample.env` to `.env`:

```bash
cp sample.env .env
```

### Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `API_KEY` | `"your-secret-key"` | Authentication key for API access |
| `DATABASE_PATH` | `"db/blog.db"` | SQLite database file location |
| `PORT` | `3000` | Server port number |

### Example `.env` file:
```env
API_KEY=my-custom-api-key
DATABASE_PATH=./data/my-blog.db
PORT=8080
```

**Note**: If no `.env` file exists, the application will use the default values shown above.

## 🤝 Contributing

This is a sample project demonstrating bun-sqlite-orm usage. Feel free to:
- Use it as a starting point for your own projects
- Report issues with the ORM usage patterns
- Suggest improvements to the examples

## 📄 License

MIT License - Feel free to use this code in your own projects.

---

**Built with ❤️ using [bun-sqlite-orm](https://www.npmjs.com/package/bun-sqlite-orm), [Bun](https://bun.sh/), and [Hono](https://hono.dev/)**
