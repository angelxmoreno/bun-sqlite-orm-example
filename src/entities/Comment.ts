import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'bun-sqlite-orm';
import { IsNotEmpty } from 'class-validator';

@Entity('comments')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsNotEmpty()
    content!: string;

    @Column()
    authorId!: number;

    @Column()
    postId!: number;

    @Column({ nullable: true })
    parentId?: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
