import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export class BadRequest extends Error {
    public status: number
    public response: string
    constructor(message: string, s: number = 400) {
        super(message);
        this.response = message;
        this.status = s;
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message)
    }
}

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const ServerErrorHandler: FastifyErrorHandler = (error, _, reply) => {
    if(error instanceof ZodError) {
        return reply.status(400).send({
            message: `Error during validating`,
            errors: error.flatten().fieldErrors
        })
    }
    
    if (error instanceof BadRequest) {
        return reply.status(error.status).send({ details: error.message})
    }

    if (error instanceof DatabaseError) {
        return reply.status(500).send({ error_type: 'Database Error', error })
    }

    return reply.status(500).send(error)
}