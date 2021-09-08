import { InternalServerErrorException } from '@nestjs/common';
import * as aws from 'aws-sdk';
import * as path from 'path';
import { FileUpload } from 'graphql-upload';
import {
  profileImageTransformer,
  storyImageTransformer,
} from './imageTransformers';

interface FileInformation {
  stream: Buffer;
  filename: string;
  mimetype: string;
}

const uploadToS3 = async (
  directory: string,
  file: FileInformation,
): Promise<string> => {
  const { filename, mimetype, stream } = file;

  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
  });

  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: `files/${directory}/${formatName(filename)}`,
    Body: stream,
    ContentType: mimetype,
  };

  const response = await s3.upload(params).promise();

  return response.Location;
};

export const uploadStoryToS3 = async (
  image: FileUpload,
  directory: string,
): Promise<string> => {
  const buffer = await getBuffer(image);
  if (!buffer) {
    throw new InternalServerErrorException();
  }
  const stream = await storyImageTransformer(buffer);
  if (!stream) {
    throw new InternalServerErrorException();
  }

  const { filename, mimetype } = await image;
  const file: FileInformation = { stream, filename, mimetype };

  return uploadToS3(directory, file);
};

export const uploadProfileImageToS3 = async (
  image: FileUpload,
  directory: string,
): Promise<string> => {
  const buffer = await getBuffer(image);
  if (!buffer) {
    throw new InternalServerErrorException();
  }

  const stream = await profileImageTransformer(buffer);
  const { filename, mimetype } = await image;
  const file: FileInformation = { stream, filename, mimetype };
  return uploadToS3(directory, file);
};

const getBuffer = async (image: FileUpload): Promise<Buffer | null> => {
  const { createReadStream } = await image;
  const buffers: any = [];
  return await new Promise<Buffer | null>(async (res) =>
    createReadStream()
      .on('data', (chunk) => {
        return buffers.push(chunk);
      })
      .on('end', () => {
        return res(Buffer.concat(buffers));
      }),
  );
};

const formatName = (filename: string): string => {
  const name = path.parse(filename).name;
  const extension = path.parse(filename).ext;
  const date = Date.now();
  const cleanFileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${date}-${cleanFileName}${extension}`;
};
