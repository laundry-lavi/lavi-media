import { FastifyInstance } from "fastify";
import { PublicObjectController } from "./controllers/public-object.controller";
import {
  addPublicObject,
  deletePublicObject,
  getPublicObjects,
} from "./schemas/public-objects";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const router = async (server: FastifyInstance) => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const publicObjectController = new PublicObjectController();

  app.put(
    "/objects/public",
    { schema: addPublicObject },
    publicObjectController.addObject
  );

  app.get(
    "/objects/public/:object_id",
    { schema: getPublicObjects },
    publicObjectController.getObject
  );

  app.delete(
    "/objects/public/:object_id",
    { schema: deletePublicObject },
    publicObjectController.deleteObject
  );
};
