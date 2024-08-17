import { randomUUID } from 'crypto';
import { ImageService } from '../../app/services/imageService';
import { SignUrlReqMimeType } from '../../app/model/generateSignedUrl';
import { S3Service } from '../../app/services/s3Service';

describe('imageService', () => {
  describe('createPutObjSignedUrl', () => {
    it('should create s3PutObjectUrl for jpg file', async () => {
      //given
      const imageService = ImageService.instance();
      const userId = randomUUID();
      const url = 'dummyUrl';
      const spyGetSigneUrl = jest
        .spyOn(S3Service.prototype, 'getSignedUrl')
        .mockImplementation(() => Promise.resolve(url));

      //when
      const result = await imageService.createPutObjSignedUrl(userId, {
        contentType: SignUrlReqMimeType.JPG,
        description: '',
        title: 'dummy_photo',
      });

      //then
      expect(result.photoId).toBeDefined();
      expect(result.signedUrl).toEqual(url);
      expect(spyGetSigneUrl).toHaveBeenCalledWith(
        process.env.AWS_S3_IMAGE_BUCKET,
        `uploads/user_${userId}/${result.photoId}.jpg`,
        {
          contentType: SignUrlReqMimeType.JPG,
          photoId: result.photoId,
          userId,
        }
      );
    });

    it('should create s3PutObjectUrl for jpeg file', async () => {
      //given
      const imageService = ImageService.instance();
      const userId = randomUUID();
      const url = 'dummyUrl';
      const spyGetSigneUrl = jest
        .spyOn(S3Service.prototype, 'getSignedUrl')
        .mockImplementation(() => Promise.resolve(url));

      //when
      const result = await imageService.createPutObjSignedUrl(userId, {
        contentType: SignUrlReqMimeType.JPEG,
        description: '',
        title: 'dummy_photo',
      });

      //then
      expect(result.photoId).toBeDefined();
      expect(result.signedUrl).toEqual(url);
      expect(spyGetSigneUrl).toHaveBeenCalledWith(
        process.env.AWS_S3_IMAGE_BUCKET,
        `uploads/user_${userId}/${result.photoId}.jpeg`,
        {
          contentType: SignUrlReqMimeType.JPEG,
          photoId: result.photoId,
          userId,
        }
      );
    });

    it('should create s3PutObjectUrl for png file', async () => {
      //given
      const imageService = ImageService.instance();
      const userId = randomUUID();
      const url = 'dummyUrl';
      const spyGetSigneUrl = jest
        .spyOn(S3Service.prototype, 'getSignedUrl')
        .mockImplementation(() => Promise.resolve(url));

      //when
      const result = await imageService.createPutObjSignedUrl(userId, {
        contentType: SignUrlReqMimeType.PNG,
        description: '',
        title: 'dummy_photo',
      });

      //then
      expect(result.photoId).toBeDefined();
      expect(result.signedUrl).toEqual(url);
      expect(spyGetSigneUrl).toHaveBeenCalledWith(
        process.env.AWS_S3_IMAGE_BUCKET,
        `uploads/user_${userId}/${result.photoId}.png`,
        {
          contentType: SignUrlReqMimeType.PNG,
          photoId: result.photoId,
          userId,
        }
      );
    });
  });
});
