import { User } from "../entity/User";
import {
	Arg,
	Ctx,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../helpers/generateToken";
import { Request, Response } from "express";
import { CONST } from "../constants/strings";

export interface MyContext {
	res: Response;
	req: Request;
}

@ObjectType()
class LoginResponse {
	@Field(() => String)
	access_token: string;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return "Hello World!";
	}

	@Mutation(() => Boolean)
	async signup(@Arg("email") email: string, @Arg("password") password: string) {
		try {
			const findUser = await User.findOne({ where: { email } });
			if (findUser) throw new Error("User with that email already exists");

			await User.insert({
				email,
				password: await hash(password, 12),
				username: email.split("@")[0], // EX: email: akj3211@gmail.com => username: akj3211
			});
			return true;
		} catch (error) {
			console.log(error);
			throw new Error("User Resolver Signup Error");
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("email") email: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	) {
		try {
			const user = await User.findOne({ where: { email } });
			if (!user) throw new Error("User with that email does not exist");

			const isPasswordValid = await compare(password, user.password);
			if (!isPasswordValid)
				throw new Error("Invalid password, please try again");

			const accessToken = generateAccessToken(user);
			const refreshToken = generateRefreshToken(user);

			res.cookie(CONST.JWT_COOKIE, refreshToken, { httpOnly: true });

			return { access_token: accessToken };
		} catch (error) {
			console.log(error);
			throw new Error("User Resolver Login Response Error");
		}
	}
}
