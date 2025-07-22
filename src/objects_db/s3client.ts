import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import EnvConfig from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BadRequest } from "../error-handler";
import { S3Object } from "../entities";

export const s3client = new S3Client({
  region: EnvConfig.get("AWS_REGION")!,
  credentials: {
    accessKeyId: EnvConfig.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: EnvConfig.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

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
    console.log(response.$metadata);
    throw new BadRequest(
      `Failed to upload file to S3, command status: ${cmd_status}`,
      500
    );
  }
}

export async function runListCommand(
  bucket: string,
  prefix?: string
): Promise<S3Object[]> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await s3client.send(command);

    if (response.Contents) {
      const list: S3Object[] = response.Contents.map((object) => {
        return {
          key: object?.Key!,
          url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
          size: object.Size,
          lastModified: object.LastModified,
        };
      });

      return list;
    }
  } catch (error) {
    throw new BadRequest(`failed in ListCommand: ${error} `, 500);
  }

  return [];
}

export async function runDeleteCommand(
  bucket: string,
  key: string
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await s3client.send(command);
  } catch (error) {
    throw new BadRequest(`failed in DeleteCommand: ${error} `, 500);
  }
}

export async function runGetCommand(
  bucket: string,
  key: string
): Promise<S3Object | null> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await s3client.send(command);
    return {
      key: key,
      url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      size: response.ContentLength,
      lastModified: response.LastModified,
    };
  } catch (error: any) {
    //console.log(error);
    if (error.name === "NoSuchKey") {
      return null;
    }
    throw new BadRequest(`failed in GetObjectCommand: ${error} `, 500);
  }
}
