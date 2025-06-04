import { FastifyInstance } from "fastify";
import { PublicObjectController } from "./controllers/public-object.controller"
import { addPublicObject } from "./schemas/public-objects";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const router = async (server: FastifyInstance) => {
	const app = server.withTypeProvider<ZodTypeProvider>();
	const publicObjectController = new PublicObjectController();

	app.post("/objects/public", { schema: addPublicObject }, publicObjectController.addObject);
};
