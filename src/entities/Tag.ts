import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'bun-sqlite-orm';
import { IsNotEmpty } from 'class-validator';

@Entity('tags')
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsNotEmpty()
    name!: string;

    @Column({ unique: true })
    @IsNotEmpty()
    slug!: string;
    @Column({ nullable: true })
    color?: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
