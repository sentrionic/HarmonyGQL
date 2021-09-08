import sharp, { Metadata, ResizeOptions } from 'sharp';

const DIM_MAX = 1080;
const DIM_MIN = 320;

export const storyImageTransformer = async (
  buffer: Buffer,
): Promise<Buffer | null> => {
  const image = sharp(buffer);
  return await new Promise<Buffer | null>(async (res) =>
    image.metadata().then((info) => {
      res(image.resize(getResizeOptions(info)).webp().toBuffer());
    }),
  );
};

const getResizeOptions = (info: Metadata): ResizeOptions => {
  let options: Record<string, unknown>;
  if (
    (info.height !== undefined && info.height < DIM_MIN) ||
    (info.width !== undefined && info.width < DIM_MIN)
  ) {
    options = {
      width: DIM_MIN,
      height: DIM_MIN,
      fit: 'outside',
    };
  } else {
    options = {
      width: DIM_MAX,
      height: DIM_MAX,
      fit: 'inside',
      withoutEnlargement: true,
    };
  }

  return options;
};

export const profileImageTransformer = (buffer: Buffer): Promise<Buffer> =>
  sharp(buffer)
    .resize({
      width: 150,
      height: 150,
    })
    .jpeg({
      quality: 75,
    })
    .toBuffer();
