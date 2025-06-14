import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'bun-sqlite-orm';
import { IsNotEmpty } from 'class-validator';

@Entity('categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsNotEmpty()
    name!: string;

    @Column()
    @IsNotEmpty()
    slug!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
