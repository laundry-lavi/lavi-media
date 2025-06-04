import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { addPublicObject } from "../schemas/public-objects";
import { IPublicObjectRepository } from "../irespository";

export class PublicObjectController {
	private readonly publicObjectRepo: IPublicObjectRepository;

	constructor(publicObjectRepo: IPublicObjectRepository) {
		this.publicObjectRepo = publicObjectRepo;
	}

	public async addObject(request: FastifyRequest, reply: FastifyReply) {
		const contentType = request.headers["content-type"];
		if (!contentType?.includes("multipart/form-data")) {
			return reply.status(400).send({ message: "Content-Type must be multipart/form-data" });
		}

		const file = await request.file();

		if (!file) return reply.code(400).send({ message: "File not found" });

		const { objectName } = request.body as z.infer<typeof addPublicObject.body>;

		return reply.status(201).send({ message: `Objeto ${objectName} recebido com sucesso` });
	}
}
