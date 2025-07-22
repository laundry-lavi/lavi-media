import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { router } from "./router";
import { ServerErrorHandler } from "./error-handler";

const app = fastify({
  ignoreTrailingSlash: true,
});

const run = async () => {
  await app.register(fastifyMultipart);

  await app.register(fastifySwagger, {
    swagger: {
      consumes: ["application/json", "multipart/form-data"],
      produces: ["application/json"],
      info: {
        title: "Lavi Media API",
        description: "An API based on AWS S3 for storing files",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(ServerErrorHandler);

  await router(app);

  const port = process.env.PORT || 7700;

  try {
    const address = await app.listen({ port: Number(port), host: "0.0.0.0" });
    console.log("Server running: ", address);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
