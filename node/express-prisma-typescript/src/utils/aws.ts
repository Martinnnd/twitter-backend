import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Constants } from './constants';
import crypto from 'crypto';

const config = {
    region: Constants.BUCKET_REGION,
    credentials: {
      accessKeyId: Constants.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: Constants.BUCKET_SECRET_ACCESS_KEY,
    },
  };


const s3 = new S3Client(config);

const generateS3UploadUrl = async (filetype: string): Promise<{ presignedUrl: string; fileUrl: string }> => {
  const extension = filetype.split('/')[1];
  const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: Constants.BUCKET_NAME, 
    Key: filename,
    ContentType: filetype
});


  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  const fileUrl = `https://${Constants.BUCKET_NAME}.s3.amazonaws.com/${filename}`;

  console.log('Presigned URL:', presignedUrl);
  console.log('File URL:', fileUrl);

  return { presignedUrl, fileUrl };
};

export { generateS3UploadUrl };
