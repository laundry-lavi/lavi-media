import { MultipartFile } from "@fastify/multipart";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { S3Object } from "../entities";
import { runPutCommand } from "../objects_db/s3client";

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
	const chunks: Buffer[] = [];
	for await (const chunk of stream) {
		chunks.push(Buffer.from(chunk));
	}

	return Buffer.concat(chunks);
};

export async function uploadFile(data: MultipartFile): Promise<S3Object> {
	const content = await streamToBuffer(data.file);
	const key = randomUUID();
	const bucketname = process.env.BUCKET_NAME || "test-bucket";

	const file = {
		key,
		content,
		bucket: bucketname,
		contentType: data.mimetype,
	};

	await runPutCommand(file);

	return {
		key,
		lastModified: new Date(),
		size: content.length,
		url: `https://${bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
	}
}
