import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'bun-sqlite-orm';
import { IsNotEmpty } from 'class-validator';

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsNotEmpty()
    title!: string;

    @Column()
    @IsNotEmpty()
    slug!: string;

    @Column()
    @IsNotEmpty()
    content!: string;

    @Column({ nullable: true })
    excerpt?: string;

    @Column({ nullable: true })
    featuredImage?: string;

    @Column({ default: PostStatus.DRAFT })
    status: PostStatus = PostStatus.DRAFT;

    @Column({ nullable: true })
    publishedAt?: Date;

    @Column()
    authorId!: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
