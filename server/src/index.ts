import "reflect-metadata";
import { createConnection } from "typeorm";
import { CONST } from "./constants/strings";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext, UserResolver } from "./graphql/UserResolver";

createConnection()
	.then(async (connection) => {
		const app = express();
		// Express middlewares
		app.use(cors());
		app.use(morgan("dev"));

		app.get("/", (req, res) => {
			res.send("Hello World!");
		});

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver],
			}),
			context: ({ req, res }): MyContext => ({ req, res }),
		});

		apolloServer.applyMiddleware({ app });

		app.listen(CONST.PORT, () =>
			console.log(
				`Express server is running on http://localhost:${CONST.PORT}/graphql`
			)
		);
	})

	.catch((error) => console.log(error));
