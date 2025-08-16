import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastify, { FastifyInstance } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ServerErrorHandler } from "./error-handler";
import { router } from "./router";

/**
 * Must be called after environment checking
 * @returns the main app instance
 */
export const buildApp = (): FastifyInstance => {
  const app = fastify();
  app.register(fastifyMultipart);
  app.register(fastifySwagger, {
    swagger: {
      consumes: ["application/json", "multipart/form-data"],
      produces: ["application/json"],
      info: {
        title: "Laví Media - API",
        description: "An API based on AWS S3 for storing files",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.setErrorHandler(ServerErrorHandler);

  app.register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/docs",
    configuration: {
      theme: "kepler",
    },
  });

  app.register(router);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  return app;
};
