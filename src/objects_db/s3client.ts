import { S3Client } from "@aws-sdk/client-s3";
import EnvConfig from "../config";

export const s3client = new S3Client({
	region: EnvConfig.get('AWS_REGION')!,
	credentials: {
		accessKeyId: EnvConfig.get('AWS_ACCESS_KEY_ID')!,
		secretAccessKey: EnvConfig.get('AWS_SECRET_ACCESS_KEY')!,
	},
});
