import { GenerateSignedUrlReq, SignUrlReqMimeType } from '../model/generateSignedUrl';
import { S3Service } from './s3Service';
import { randomUUID } from 'crypto';
export class ImageService {
  private readonly s3Service: S3Service;

  public async createPutObjSignedUrl(userId: string, photoMetaData: GenerateSignedUrlReq) {
    const photoId = randomUUID();
    const key = this.generateKey(userId, photoId, photoMetaData.contentType);
    const signedUrl = await this.s3Service.getSignedUrl(`${process.env.AWS_S3_IMAGE_BUCKET}`, key, {
      contentType: photoMetaData.contentType,
      photoId,
      userId,
    });

    return {
      signedUrl,
      photoId,
    };
  }

  private generateKey(userId: string, photoId: string, contentType: string) {
    return `uploads/user_${userId}/${photoId}.${this.getFileSuffixForContentType(contentType)}`;
  }

  private getFileSuffixForContentType(contentType: SignUrlReqMimeType): string {
    switch (contentType) {
      case SignUrlReqMimeType.JPEG:
        return 'jpeg';
      case SignUrlReqMimeType.JPG:
        return 'jpg';
      case SignUrlReqMimeType.PNG:
        return 'png';
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }
  }

  constructor(s3Service: S3Service) {
    this.s3Service = s3Service;
  }

  private static _instance: ImageService;

  public static instance(): ImageService {
    if (!ImageService._instance) {
      ImageService._instance = new ImageService(S3Service.instance());
    }
    return ImageService._instance;
  }
}
