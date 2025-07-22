import { FastifyReply, FastifyRequest } from "fastify";
import { uploadFile } from "../services/upload-file";
import { getPublicObjects } from "../schemas/public-objects";
import { z } from "zod";
import {
  runDeleteCommand,
  runGetCommand,
  runListCommand,
} from "../objects_db/s3client";
import EnvConfig from "../config";

export class PublicObjectController {
  public async addObject(request: FastifyRequest, reply: FastifyReply) {
    const contentType = request.headers["content-type"];
    if (!contentType?.includes("multipart/form-data")) {
      return reply
        .status(400)
        .send({ message: "Content-Type must be multipart/form-data" });
    }

    const file = await request.file();

    if (!file) return reply.code(400).send({ message: "File not found" });

    const s3Object = await uploadFile(file);

    return reply
      .status(201)
      .send({ message: `Objeto recebido com sucesso`, details: s3Object });
  }

  public async getObject(request: FastifyRequest, reply: FastifyReply) {
    const { object_id } = request.params as z.infer<
      typeof getPublicObjects.params
    >;

    const result = await runListCommand(
      EnvConfig.get("BUCKET_NAME")!,
      object_id
    );

    if (result.length == 0) {
      return reply
        .code(404)
        .send({ data: { objects: result }, details: "Objects not found!" });
    }

    return reply.code(200).send({ data: { objects: result } });
  }

  public async deleteObject(request: FastifyRequest, reply: FastifyReply) {
    const { object_id } = request.params as any;

    const obj = await runGetCommand(EnvConfig.get("BUCKET_NAME")!, object_id);

    if (!obj) {
      return reply.code(404).send({ details: "Object not found!" });
    }

    await runDeleteCommand(EnvConfig.get("BUCKET_NAME")!, object_id);

    return reply.code(204).send();
  }
}
