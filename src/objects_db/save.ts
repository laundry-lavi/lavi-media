import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "./s3client";
import { BadRequest } from "../error-handler";

type s3ObjectProps = {
	key: string;
	bucket: string;
	content: Buffer | Uint8Array | Blob | string;
	contentType: string;
};

export async function runPutCommand(object: s3ObjectProps) {
	const command = new PutObjectCommand({
		Bucket: object.bucket,
		Key: object.key,
		Body: object.content,
		ContentType: object.contentType,
	});

	const response = await s3client.send(command);
	const cmd_status = response.$metadata.httpStatusCode;
	if (cmd_status !== 201 && cmd_status !== 200) {
		throw new BadRequest(`Failed to upload file to S3, command status: ${cmd_status}`, 500);
	}
}
