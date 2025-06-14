import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'bun-sqlite-orm';
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

    @Column()
    @IsNotEmpty()
    firstName!: string;

    @Column()
    @IsNotEmpty()
    lastName!: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
