import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_PHOTO_EXPIRY } from '../util/constant';
import { GetSignedUrlParam } from '../model/generateSignedUrl';

export class S3Service {
  private s3: S3Client = new S3Client({});

  public async getSignedUrl(bucket: string, key: string, metaData: GetSignedUrlParam): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: metaData.contentType,
      // Set Metadata fields to be retrieved post-upload and stored in DynamoDB
      Metadata: {
        ...metaData,
      },
    });

    return getSignedUrl(this.s3, command, {
      signableHeaders: new Set(['content-type']),
      expiresIn: S3_PHOTO_EXPIRY,
    });
  }

  constructor() {}

  static me: S3Service;
  public static instance = (): S3Service => {
    if (!S3Service.me) {
      S3Service.me = new S3Service();
    }

    return S3Service.me;
  };
}
