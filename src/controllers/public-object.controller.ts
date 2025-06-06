import { FastifyReply, FastifyRequest } from "fastify";
import { IPublicObjectRepository } from "../irespository";
import { uploadFile } from "../services/upload-file";

export class PublicObjectController {
	private readonly publicObjectRepo: IPublicObjectRepository;

	public async addObject(request: FastifyRequest, reply: FastifyReply) {
		const contentType = request.headers["content-type"];
		if (!contentType?.includes("multipart/form-data")) {
			return reply.status(400).send({ message: "Content-Type must be multipart/form-data" });
		}

		const file = await request.file();

		if (!file) return reply.code(400).send({ message: "File not found" });

		const s3Object = await uploadFile(file);

		return reply.status(201).send({ message: `Objeto recebido com sucesso`, details: s3Object });
	}
}
