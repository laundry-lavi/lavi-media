import fastify from "fastify";
import {
	validatorCompiler,
	serializerCompiler,
	jsonSchemaTransform,
} from "fastify-type-provider-zod";

import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import EnvConfig from './config';

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
				title: "Laundry Media API",
				description: "...",
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

	app.listen({ port: 7700 }).then(() => {
		console.log("Server Running => PORT: 7700");
	});
};

run();