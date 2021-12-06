import { User } from "../entity/User";
import {
	Arg,
	Ctx,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { Note } from "../entity/Note";
import { isAuth } from "../helpers/isAuth";
import { MyContext } from "./UserResolver";

@Resolver()
export class NoteResolver {
	@Query(() => [Note])
	@UseMiddleware(isAuth)
	async listNotes(@Ctx() ctx: MyContext) {
		return Note.find({ relations: ["created_by"] });
	}

	@Mutation(() => Note)
	@UseMiddleware(isAuth)
	async addNote(
		@Arg("title") title: string,
		@Arg("content") content: string,
		@Ctx() ctx: MyContext
	) {
		try {
			const user = await User.findOne(ctx.tokenPayload?.userId);
			const insertNote = new Note();
			insertNote.title = title;
			insertNote.content = content;
			insertNote.created_by = user!;
			await insertNote.save();
			return insertNote;
		} catch (err: any) {
			throw new Error(err);
		}
	}

	@Mutation(() => Note)
	@UseMiddleware(isAuth)
	async updateNote(
		@Arg("title") title: string,
		@Arg("content") content: string,
		@Arg("noteId") noteId: string
	) {
		try {
			const note = await Note.findOne(noteId, { relations: ["created_by"] });
			if (!note) throw new Error("Cannot find note");

			note.title = title;
			note.content = content;
			await note.save();
			return note;
		} catch (err: any) {
			throw new Error(err);
		}
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteNote(@Arg("noteId") noteId: string) {
		try {
			const note = await Note.findOne(noteId, { relations: ["created_by"] });
			if (!note) throw new Error("Cannot find note to delete");

			await note.remove();
			return true;
		} catch (err: any) {
			throw new Error(err);
		}
	}
}
