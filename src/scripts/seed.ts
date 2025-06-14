import { initializeDatabase } from '@/config/database';
import { Category, Comment, Post, PostStatus, Tag, User } from '@/entities';
import { faker } from '@faker-js/faker';

async function seed() {
    console.log('🌱 Starting database seeding...');

    // Initialize database first
    try {
        await initializeDatabase();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }

    try {
        console.log('📝 Creating users...');
        const users: User[] = [];
        for (let i = 0; i < 10; i++) {
            try {
                const user = User.build({
                    email: faker.internet.email(),
                    username: faker.internet.username(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    bio: faker.lorem.paragraph(),
                    avatar: faker.image.avatar(),
                });

                await user.save();
                users.push(user);
            } catch (error) {
                console.warn(
                    `⚠️ Failed to create user ${i + 1}:`,
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
        console.log(`✅ Created ${users.length} users`);

        console.log('📂 Creating categories...');
        const categoryNames = [
            'Technology',
            'Programming',
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Design',
            'Business',
            'Tutorial',
        ];
        const categories: Category[] = [];

        for (const name of categoryNames) {
            try {
                const category = Category.build({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    description: faker.lorem.sentence(),
                });

                await category.save();
                categories.push(category);
            } catch (error) {
                console.warn(
                    `⚠️ Failed to create category '${name}':`,
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
        console.log(`✅ Created ${categories.length} categories`);

        console.log('🏷️ Creating tags...');
        const tagNames = [
            'JavaScript',
            'TypeScript',
            'React',
            'Node.js',
            'Python',
            'Java',
            'CSS',
            'HTML',
            'Database',
            'API',
            'Frontend',
            'Backend',
            'Tutorial',
            'Guide',
            'Tips',
            'Best Practices',
            'Performance',
            'Security',
            'DevOps',
            'Testing',
        ];
        const tags: Tag[] = [];

        for (const name of tagNames) {
            try {
                const tag = Tag.build({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    color: faker.color.rgb(),
                });

                await tag.save();
                tags.push(tag);
            } catch (error) {
                console.warn(
                    `⚠️ Failed to create tag '${name}':`,
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
        console.log(`✅ Created ${tags.length} tags`);

        console.log('📄 Creating posts...');
        const posts: Post[] = [];
        for (let i = 0; i < 50; i++) {
            try {
                if (users.length === 0) {
                    console.warn('⚠️ No users available to create posts');
                    break;
                }

                const author = faker.helpers.arrayElement(users);
                const status = faker.helpers.arrayElement([
                    PostStatus.DRAFT,
                    PostStatus.PUBLISHED,
                    PostStatus.ARCHIVED,
                ]);

                const postData = {
                    title: faker.lorem.sentence(),
                    slug: faker.lorem.slug(),
                    content: faker.lorem.paragraphs(5, '\n\n'),
                    excerpt: faker.lorem.paragraph(),
                    featuredImage: faker.image.url(),
                    status,
                    authorId: author.id,
                    publishedAt: status === PostStatus.PUBLISHED ? faker.date.past() : undefined,
                };

                const post = Post.build(postData);
                await post.save();
                posts.push(post);
            } catch (error) {
                console.warn(
                    `⚠️ Failed to create post ${i + 1}:`,
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
        console.log(`✅ Created ${posts.length} posts`);

        console.log('💬 Creating comments...');
        const comments: Comment[] = [];
        for (let i = 0; i < 100; i++) {
            try {
                if (users.length === 0) {
                    console.warn('⚠️ No users available to create comments');
                    break;
                }
                if (posts.length === 0) {
                    console.warn('⚠️ No posts available to create comments');
                    break;
                }

                const author = faker.helpers.arrayElement(users);
                const post = faker.helpers.arrayElement(posts);
                const parentComment =
                    faker.datatype.boolean(0.3) && comments.length > 0
                        ? faker.helpers.arrayElement(comments)
                        : undefined;

                const commentData = {
                    content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
                    authorId: author.id,
                    postId: post.id,
                    parentId: parentComment?.id,
                };

                const comment = Comment.build(commentData);
                await comment.save();
                comments.push(comment);
            } catch (error) {
                console.warn(
                    `⚠️ Failed to create comment ${i + 1}:`,
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
        console.log(`✅ Created ${comments.length} comments`);

        console.log('🎉 Database seeding completed successfully!');
        console.log(`
📊 Summary:
- ${users.length} Users
- ${categories.length} Categories  
- ${tags.length} Tags
- ${posts.length} Posts
- ${comments.length} Comments
`);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed()
    .then(() => {
        console.log('✨ Seeding process finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Fatal error during seeding:', error);
        process.exit(1);
    });
