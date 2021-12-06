import { Field, Int, ObjectType } from "type-graphql";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
import { Note } from "./Note";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => String) // for graphql return type
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column()
	email: string;

	@Field(() => String)
	@Column()
	username: string;

	@Column()
	password: string;

	@Field(() => Int)
	@Column("int", { default: 0 })
	token_version: number;

	@Field(() => Int)
	@Column("int", { default: 0 })
	createdBy: string;

	@OneToMany(() => Note, (note) => note.created_by)
	notes: Note[];
}
