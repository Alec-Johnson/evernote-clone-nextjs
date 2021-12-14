import "reflect-metadata";
import { createConnection } from "typeorm";
import { CONST } from "./constants/strings";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext, UserResolver } from "./graphql/UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import {
	generateAccessToken,
	generateRefreshToken,
	sendRefreshToken,
} from "./helpers/generateToken";
import cookieParser from "cookie-parser";
import { NoteResolver } from "./graphql/NoteResolver";

createConnection()
	.then(async (connection) => {
		const app = express();
		// Express middlewares
		app.use(
			cors({
				origin: "http://localhost:3000",
				credentials: true,
			})
		);
		app.use(cookieParser());
		app.use(morgan("dev"));

		app.get("/", (req, res) => {
			res.send("Hello World!");
		});

		app.post("/refresh-token", async (req, res) => {
			const token = req.cookies[CONST.JWT_COOKIE];
			if (!token) return res.send({ success: false, access_token: " " });

			let data: any = null;
			try {
				data = verify(token, CONST.REFRESH_TOKEN_SECRET);
			} catch (err) {
				return res.send({ success: false, access_token: " " });
			}

			const user = await User.findOne(data.userId);
			if (!user) {
				return res.send({ success: false, access_token: " " });
			}

			if (user.token_version !== data.tokenVersion) {
				return res.send({ success: false, access_token: " " });
			}

			const access_token = generateAccessToken(user);
			sendRefreshToken(res, generateRefreshToken(user));

			return res.send({ success: true, access_token });
		});

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver, NoteResolver],
			}),
			context: ({ req, res }): MyContext => ({ req, res }),
		});

		apolloServer.applyMiddleware({ app, cors: false }); // cors: false to disable cors for graphql

		app.listen(CONST.PORT, () =>
			console.log(
				`Express server is running on http://localhost:${CONST.PORT}/graphql`
			)
		);
	})

	.catch((error) => console.log(error));
